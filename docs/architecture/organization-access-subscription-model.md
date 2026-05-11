---
document_type: architecture-model
status: accepted
date: 2026-05-11
language: ru
owners:
  - product
  - architecture
related_docs:
  - docs/architecture/source-of-truth.md
  - docs/architecture/access-and-subscriptions.md
  - docs/architecture/documentation-workflow.md
  - docs/stages/MVP.md
  - docs/stages/v1.md
  - docs/stages/v2.md
---

# Organization access/subscription model

Этот документ фиксирует детальную модель `Organization`, глобального `User`, участия пользователя в организации, ролей, приглашений, organization codes, подписок и seats.

Он дополняет `docs/architecture/access-and-subscriptions.md`: там зафиксированы верхнеуровневые guardrails доступа и human gates, здесь — рекомендуемые сущности, связи, транзакционные сценарии и ограничения для implementation slices.

Терминология для FinLit:

- `Organization` — единый термин; `Company` в модели не используется.
- `OrgMembership` / `org_memberships` — каноническое имя связи `User` и `Organization`. В исходных обсуждениях это может называться `Member`, но код, схемы и новые docs должны использовать `OrgMembership`/`org_membership`, чтобы не возникал shortcut `user.organization_id`.
- `members.*` в permission-кодах допустим как доменный namespace для операций со списком сотрудников; это не имя таблицы.
- Подписки, seats, Pro-доступ и paid tier state не являются RBAC-ролями.

## 1. Ключевая идея

Система строится вокруг разделения глобальной учетной записи пользователя и его участия в конкретной организации.

```text
User отвечает на вопрос: кто это?
Organization отвечает на вопрос: к какой организации относится доступ?
OrgMembership отвечает на вопрос: кем этот User является внутри Organization?
Role / Permission отвечают на вопрос: что OrgMembership может делать?
Subscription / Seat отвечают на вопрос: какой платный уровень продукта доступен?
```

В проекте используем единый термин **Organization**. Термин `Company` в модели не используется.

---

## 2. Основные сущности

### 2.1. `User`

`User` — глобальная учетная запись человека в системе.

Один `User` может быть участником нескольких организаций и иметь разные роли в каждой из них.

Пример полей:

```text
users
- id
- login
- email / phone, если login не является email
- password_hash
- full_name
- status: pending | active | blocked
- email_verified_at / phone_verified_at
- created_at
- updated_at
```

Важно: `User` не должен хранить роль внутри организации. Роль пользователя определяется не самим `User`, а его `OrgMembership`-записью в конкретной `Organization`.

---

### 2.2. `Organization`

`Organization` — организация, в рамках которой пользователи получают доступы, роли, подписки и места.

Пример полей:

```text
organizations
- id
- name
- status: pending | active | suspended | deleted
- created_by_user_id, nullable
- created_at
- updated_at
```

Статус `pending` используется, например, на этапе регистрации организации до того, как первый администратор подтвердил доступ.

---

### 2.3. `OrgMembership`

`OrgMembership` — связь между `User` и `Organization`.

Именно `OrgMembership`, а не `User`, получает роли внутри организации.

Пример полей:

```text
org_memberships
- id
- organization_id
- user_id
- display_name
- status: active | suspended | removed
- invited_by_org_membership_id, nullable
- accepted_at
- created_at
- updated_at
```

Обязательный уникальный индекс:

```text
unique(organization_id, user_id)
```

Это гарантирует, что один и тот же пользователь не будет создан как несколько разных участников одной организации.

`OrgMembership.display_name` нужен отдельно от `User.full_name`, потому что имя пользователя в конкретной организации может отличаться от его глобального имени в системе.

---

## 3. Роли и права

Для управления доступами используется RBAC-модель.

Основные таблицы:

```text
roles
permissions
role_permissions
org_membership_roles
```

Связь выглядит так:

```text
OrgMembership * --- * Role
Role   * --- * Permission
```

Рекомендуемые названия таблиц:

```text
roles
permissions
role_permissions
org_membership_roles
```

Не рекомендуется использовать разные стили вроде `member2role`, `RoleToPermission`, `role_to_permission`. Лучше сразу выбрать единый snake_case-стиль.

---

## 4. Примеры ролей

```text
org.admin
hr
analyst
business.manager
lecture.reader
```

Роль `org.admin` используется для администратора организации.

Роль `lecture.reader` используется для пользователя мобильного приложения, который может читать лекции.

---

## 5. Примеры permissions

```text
admin.panel.access
organization.settings.manage
members.invite
members.manage
members.roles.manage
analytics.view
billing.manage
mobile.app.access
lectures.read
lectures.read_pro
```

Бизнес-логика должна проверять не название роли, а наличие конкретного permission.

Например:

```text
HR role:
- admin.panel.access
- members.invite
- members.manage

Analyst role:
- admin.panel.access
- analytics.view

Lecture reader role:
- mobile.app.access
- lectures.read
```

Так можно будет менять состав ролей без переписывания основной логики приложения.

---

## 6. Безопасная модель приглашений и задания пароля

Приглашение в организацию и задание пароля — это разные процессы.

Нельзя делать ссылку, по которой любой человек, получивший ее от администратора, может задать пароль за другого пользователя.

Правильная модель:

```text
Invitation отвечает за приглашение в Organization.
Password setup / login verification отвечает за подтверждение личности и установку пароля.
```

### 6.1. Для существующего пользователя

Если `User` с указанным `login` уже существует:

```text
1. Система создает Invitation.
2. Пользователь получает приглашение.
3. При переходе по приглашению пользователь должен войти в свой существующий аккаунт.
4. После успешного входа он принимает приглашение.
5. Только после acceptance создается или обновляется доступ внутри Organization.
```

Для существующего пользователя приглашение не должно сбрасывать пароль и не должно позволять задать новый пароль.

---

### 6.2. Для нового пользователя

Если `User` с указанным `login` еще не существует:

```text
1. Система создает Invitation.
2. Система отправляет приглашение на подтверждаемый канал пользователя: email, phone или другой login-канал.
3. Пользователь подтверждает владение этим login-каналом.
4. Пользователь задает пароль.
5. После успешного подтверждения и задания пароля создается User.
6. После этого создается OrgMembership и назначаются роли.
```

Администратор не получает ссылку, которая позволяет задать пароль за пользователя.

Если продукту нужна ручная передача ссылки администратором, такая ссылка должна открывать только страницу принятия приглашения. Она не должна позволять задать пароль без подтверждения владения login/email/phone.

---

## 7. Сущность `Invitation`

Приглашение должно быть отдельной сущностью.

Пример полей:

```text
invitations
- id
- organization_id
- target_login
- target_full_name
- invited_by_org_membership_id
- token_hash
- type: organization_owner | member_invite | organization_code_join
- status: pending | accepted | expired | revoked
- expires_at
- accepted_at
- created_at
- updated_at
```

Токен приглашения в базе лучше хранить не в открытом виде, а как hash.

Для ролей, которые должны быть выданы после принятия приглашения, используется отдельная таблица:

```text
invitation_roles
- invitation_id
- role_id
```

Это позволяет приглашать пользователя сразу с одной или несколькими ролями.

---

## 8. Когда создавать `OrgMembership`

Выбранная модель: **`OrgMembership` создается только после acceptance**.

То есть при формировании приглашения не создаются заранее:

```text
OrgMembership
OrgMembershipRole
SeatAssignment
```

На этапе приглашения создаются только:

```text
Invitation
InvitationRole
```

После того как пользователь принял приглашение, система в одной транзакции выполняет:

```text
1. Находит или создает User.
2. Создает OrgMembership в Organization.
3. Создает записи org_membership_roles.
4. При необходимости закрепляет subscription seat.
5. Переводит Invitation в status = accepted.
```

Если приглашение истекло, то удалять `OrgMembership` или `OrgMembershipRole` не нужно, потому что они еще не были созданы.

При истечении приглашения достаточно выполнить:

```text
Invitation.status = expired
```

---

## 9. Регистрация новой Organization

Сценарий регистрации организации:

```text
1. Пользователь открывает страницу регистрации Organization.
2. Вводит:
   - название Organization;
   - свое ФИО;
   - login.
3. Система создает Organization со статусом pending.
4. Система создает Invitation type = organization_owner.
5. В Invitation указывается роль org.admin.
6. Пользователь подтверждает login и, если он новый, задает пароль.
7. После acceptance система создает User, если его еще нет.
8. Система создает OrgMembership между User и Organization.
9. Система назначает этому OrgMembership роль org.admin.
10. Organization переводится в status = active.
11. Пользователь попадает в кабинет Organization как администратор.
```

Если `User` с указанным `login` уже существует, он должен войти под своим существующим паролем и принять создание админского доступа к новой `Organization`.

Если `User` еще не существует, он подтверждает login-канал, задает пароль, после чего создается его учетная запись.

---

## 10. Приглашение сотрудников администратором

Администратор Organization может выдавать доступы на отдельном экране сотрудников.

Он указывает:

```text
- login пользователя;
- ФИО пользователя;
- одну или несколько ролей.
```

Примеры ролей:

```text
hr
analyst
business.manager
lecture.reader
```

Сценарий:

```text
1. Администратор открывает экран сотрудников.
2. Указывает login, ФИО и роль/роли.
3. Система проверяет, что администратор имеет permission members.invite или members.manage.
4. Система создает Invitation.
5. Система создает InvitationRole для выбранных ролей.
6. Система отправляет приглашение пользователю на подтверждаемый login-канал.
7. Пользователь принимает приглашение.
8. Если пользователь уже существует, он логинится в существующий аккаунт.
9. Если пользователя еще нет, он подтверждает login-канал и задает пароль.
10. После acceptance система создает User, если нужно.
11. Система создает OrgMembership в Organization.
12. Система назначает OrgMembership выбранные роли.
13. Если роль требует seat, система закрепляет seat.
14. Invitation получает status = accepted.
```

Если приглашение истекло:

```text
Invitation.status = expired
```

`User`, `OrgMembership`, `OrgMembershipRole` и `SeatAssignment` не требуют удаления, потому что при выбранной модели они создаются только после acceptance.

---

## 11. Вход через код Organization

Кроме приглашения конкретного пользователя, администратор может предоставить код Organization.

Код используется, например, для пользователей мобильного приложения, которые должны получить роль `lecture.reader`.

Код не стоит хранить как обычное поле в `Organization`. Лучше использовать отдельную сущность.

```text
organization_codes
- id
- organization_id
- code_hash
- default_role_id
- status: active | disabled | expired
- max_uses, nullable
- current_uses
- expires_at, nullable
- created_by_org_membership_id
- created_at
- updated_at
```

`default_role_id` для такого кода обычно указывает на роль:

```text
lecture.reader
```

Код должен быть:

```text
- случайным;
- достаточно длинным;
- отзывным;
- ограниченным по сроку действия;
- при необходимости ограниченным по количеству использований;
- хранимым в базе как hash, а не в открытом виде.
```

---

## 12. Сценарий входа по коду Organization

```text
1. Пользователь открывает мобильное приложение.
2. Вводит код Organization.
3. Система находит активный OrganizationCode.
4. Система проверяет:
   - код существует;
   - код активен;
   - код не истек;
   - Organization активна;
   - не превышен max_uses;
   - есть свободные seats, если роль требует seat.
5. Пользователь вводит ФИО, login и пароль.
6. Если User уже существует, пользователь должен войти в существующий аккаунт.
7. Если User не существует, он подтверждает login-канал и задает пароль.
8. После подтверждения система создает User, если нужно.
9. Система создает OrgMembership в Organization.
10. Система назначает OrgMembership роль lecture.reader.
11. Система закрепляет seat, если роль lecture.reader потребляет место подписки.
12. Пользователь получает доступ к лекциям в рамках Organization.
```

Если пользователь уже имеет `OrgMembership` в этой `Organization`, система не должна создавать дубликат. В этом случае можно либо ничего не делать, либо добавить недостающую роль `lecture.reader`, если бизнес-логика это разрешает.

---

## 13. Подписочная модель

В системе есть два независимых типа подписок:

```text
1. Персональная подписка User.
2. Организационная подписка Organization.
```

Они работают в разных контекстах и не смешиваются.

---

## 14. `Plan`

Лучше вынести тарифы в отдельную таблицу `plans`, а не хранить `type`, `is_pro` и `custom_config` прямо как основную логику подписки.

```text
plans
- id
- code: basic | team | enterprise | personal_pro
- name
- scope: user | organization
- is_pro
- default_seats_limit, nullable
- features_config
- created_at
- updated_at
```

Пример `features_config`:

```json
{
  "pro_content": true,
  "analytics": true,
  "custom_limits": {
    "seats": 500
  }
}
```

---

## 15. Персональная подписка `UserSubscription`

Персональная подписка привязана к `User`.

```text
user_subscriptions
- id
- user_id
- plan_id
- status: active | past_due | cancelled | expired
- started_at
- current_period_end
- cancel_at_period_end
- provider
- provider_subscription_id
- created_at
- updated_at
```

Персональная подписка дает пользователю Pro-доступ только в его личном пространстве.

---

## 16. Организационная подписка `OrgSubscription`

Организационная подписка привязана к `Organization`.

```text
org_subscriptions
- id
- organization_id
- plan_id
- status: active | past_due | cancelled | expired
- seats_limit
- current_period_end
- cancel_at_period_end
- custom_config
- provider
- provider_subscription_id
- created_at
- updated_at
```

`custom_config` нужен для enterprise-настроек и индивидуальных условий.

Например:

```json
{
  "pro_content": true,
  "analytics": true,
  "seats_limit_override": 1000
}
```

---

## 17. Seats

Количество пользователей с ролью `lecture.reader` в Organization ограничивается количеством мест в организационной подписке.

Не рекомендуется хранить `current_seats` как главный источник истины.

Лучше использовать отдельную таблицу назначенных мест:

```text
org_subscription_seats
- id
- org_subscription_id
- org_membership_id
- status: active | released
- assigned_at
- released_at
- created_at
- updated_at
```

Тогда занятое количество мест считается так:

```text
current_seats = count(org_subscription_seats where status = active)
```

`current_seats` можно кэшировать для производительности, но источником истины должны быть активные записи `org_subscription_seats`.

---

## 18. Выбранная логика: личный Pro vs корпоративный Basic

Выбран формат: **личный Pro работает только в личном пространстве, а корпоративное обучение полностью управляется подпиской Organization**.

Это значит:

```text
Personal context -> используется UserSubscription.
Organization context -> используется OrgSubscription.
```

Если пользователь имеет личную Pro-подписку, но заходит в контексте Organization с тарифом Basic, то в корпоративном контексте он видит только тот уровень контента, который разрешен подпиской Organization.

Личная Pro-подписка не расширяет корпоративный доступ.

Корпоративная подписка не расширяет личный доступ пользователя вне Organization.

Такой подход предотвращает смешение личной оплаты, корпоративных правил, аналитики и доступов.

---

## 19. Проверка доступа к лекциям в личном пространстве

Для личного пространства:

```text
1. Найти активную UserSubscription пользователя.
2. Проверить, что subscription.status = active.
3. Проверить, что plan.scope = user.
4. Проверить plan.is_pro или features_config.pro_content.
5. Если Pro есть — показать Pro-контент.
6. Если Pro нет — показать только базовый контент.
```

---

## 20. Проверка доступа к лекциям в Organization

Для корпоративного пространства:

```text
1. Найти активный OrgMembership по user_id + organization_id.
2. Проверить, что OrgMembership.status = active.
3. Проверить, что у OrgMembership есть permission mobile.app.access.
4. Проверить, что у OrgMembership есть permission lectures.read.
5. Найти активную OrgSubscription для Organization.
6. Проверить, что subscription.status = active.
7. Проверить, что у OrgMembership есть активный org_subscription_seat, если роль потребляет seat.
8. Проверить plan.is_pro или org_subscription.custom_config.pro_content.
9. Если Organization-подписка дает Pro — показать Pro-контент.
10. Если Organization-подписка не дает Pro — показать базовый контент.
```

Личная подписка пользователя на этом этапе не учитывается.

---

## 21. Рекомендуемая итоговая схема таблиц

Минимальный набор:

```text
users
organizations
org_memberships

roles
permissions
role_permissions
org_membership_roles

invitations
invitation_roles

organization_codes

plans
user_subscriptions
org_subscriptions
org_subscription_seats

audit_logs
```

---

## 22. Важные индексы и ограничения

```text
users.login unique
org_memberships unique(organization_id, user_id)
roles.code unique
permissions.code unique
organization_codes.code_hash unique
invitations.token_hash unique
```

Для `org_membership_roles` желательно ограничение:

```text
unique(org_membership_id, role_id)
```

Для `role_permissions`:

```text
unique(role_id, permission_id)
```

Для активных seats желательно не допускать двух активных мест на одного `OrgMembership` в рамках одной активной подписки.

---

## 23. Audit log

Для B2B-системы желательно вести журнал действий.

```text
audit_logs
- id
- actor_user_id
- actor_org_membership_id
- organization_id
- action
- target_type
- target_id
- metadata
- created_at
```

Нужно логировать:

```text
- создание Organization;
- принятие owner invitation;
- приглашение пользователя;
- принятие приглашения;
- истечение приглашения;
- отзыв приглашения;
- назначение роли;
- снятие роли;
- создание OrganizationCode;
- отключение OrganizationCode;
- вход по OrganizationCode;
- изменение подписки;
- назначение seat;
- освобождение seat.
```

---

## 24. Транзакционность и защита от гонок

Операции acceptance должны выполняться в транзакции.

Особенно важно для сценариев:

```text
- принятие приглашения;
- вход по OrganizationCode;
- назначение роли lecture.reader;
- закрепление subscription seat.
```

При acceptance нужно атомарно проверить:

```text
1. Invitation / OrganizationCode все еще активен.
2. Срок действия не истек.
3. Organization активна.
4. Пользователь прошел login verification или authentication.
5. OrgMembership еще не существует, либо существует и может быть обновлен.
6. Есть свободный seat, если роль требует seat.
7. Роль может быть назначена.
```

После этого в той же транзакции создаются:

```text
User, если нужен;
OrgMembership;
OrgMembershipRole;
OrgSubscriptionSeat, если нужен.
```

---

## 25. Итоговая логика в одном виде

### 25.1. Регистрация Organization

```text
Registration form
↓
Create pending Organization
↓
Create owner Invitation with role org.admin
↓
User confirms login / signs in
↓
Acceptance transaction
↓
Create User if needed
↓
Create OrgMembership
↓
Assign org.admin role
↓
Activate Organization
↓
Redirect to Organization admin cabinet
```

---

### 25.2. Приглашение сотрудника

```text
Admin selects login, full name, roles
↓
Create Invitation
↓
Create InvitationRole records
↓
Send invitation to target login channel
↓
User signs in or creates account after verification
↓
Acceptance transaction
↓
Create OrgMembership
↓
Assign selected roles
↓
Assign seat if needed
↓
Mark Invitation as accepted
```

---

### 25.3. Истечение приглашения

```text
Invitation expires
↓
Invitation.status = expired
↓
No OrgMembership cleanup needed
↓
No OrgMembershipRole cleanup needed
↓
No Seat cleanup needed
```

Поскольку `OrgMembership`, `OrgMembershipRole` и `SeatAssignment` создаются только после acceptance, истекшее приглашение не оставляет лишних доступов.

---

### 25.4. Вход по коду Organization

```text
User enters OrganizationCode
↓
System validates code
↓
System validates seats
↓
User signs in or creates account after verification
↓
Create OrgMembership
↓
Assign lecture.reader role
↓
Assign seat
↓
Open mobile lecture access in Organization context
```

---

### 25.5. Доступ к Pro-контенту

```text
Personal context:
UserSubscription determines Basic / Pro.

Organization context:
OrgSubscription determines Basic / Pro.
```

Личная Pro-подписка не влияет на корпоративный контекст.

Корпоративная Pro-подписка не влияет на личное пространство пользователя.

---

## 26. Главные архитектурные рекомендации

1. Использовать `Organization` как единый термин во всей системе.
2. Разделить `User` и `OrgMembership`.
3. Создавать `OrgMembership` только после acceptance.
4. Использовать `Invitation` как полноценную сущность.
5. Не смешивать invitation link и password setup link.
6. Для существующего пользователя требовать вход в существующий аккаунт.
7. Для нового пользователя требовать подтверждение login-канала перед созданием пароля.
8. Использовать `OrganizationCode` как отдельную отзывную сущность.
9. Проверять доступы через permissions, а не через названия ролей.
10. Seats считать через активные `org_subscription_seats`.
11. Личную и корпоративную подписки держать в разных контекстах.
12. Все acceptance-сценарии выполнять транзакционно.
13. Вести audit log для действий с доступами, ролями, кодами и подписками.

---

## 27. Короткое резюме

Итоговая модель:

```text
User — глобальный человек в системе.
Organization — организация.
OrgMembership — участие User в Organization.
Role / Permission — права OrgMembership внутри Organization.
Invitation — намерение выдать доступ, которое еще не создало OrgMembership.
OrganizationCode — массовый или самостоятельный вход в Organization.
UserSubscription — личный Pro-доступ пользователя.
OrgSubscription — корпоративный доступ Organization.
OrgSubscriptionSeat — занятое место в корпоративной подписке.
```

Основной принцип:

```text
Сначала пользователь подтверждает личность и принимает доступ.
Только после этого система создает OrgMembership, назначает роли и закрепляет seat.
```
