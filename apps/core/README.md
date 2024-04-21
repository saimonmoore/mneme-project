TODO:

- Login after data directory already exists:
  - Node 1: await mneme.login(email, password) works!
  - Node 2:
    - login doesn't work, neither are they automatically logged in.
    - Can't test non-boostrapped login because storage needs to be 2nd arg. Don't use positional args!
- Test adding/querying friends
- Test adding/querying records
- Fix updating updatedAt automatically when entities are updated.
- Update to latest version of autobase.
- Fix existing tests.
- Add new tests.
- Migrate to bare
- Retry peer expo
- Build simple mobile UI
- If other native libs is a problem in bare, then maybe think about simplifying calls to claude ai, or only use when in node (and use node for desktop/nasvermell instance)
- Building simple pear desktop UI