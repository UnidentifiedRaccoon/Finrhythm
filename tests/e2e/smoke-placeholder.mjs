const result = {
  status: "SKIPPED_NO_BROWSER_TARGET",
  checked_at: new Date().toISOString(),
  reason: "MVP-01 bootstrap slice has no employee/admin web runtime yet.",
  next_required_slice: "Add browser e2e once apps/web or apps/admin has a runnable route."
};

console.log(JSON.stringify(result, null, 2));
