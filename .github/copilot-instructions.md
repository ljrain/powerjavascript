This is a JavaScript based repository for scripts, functions, routines that are used against 
Dataverse JavaScript SDK at certain API endpoints. It is primarly responsbile for client side event processing in a Model Driven Power Apps. 

Please follow these guidelines when contributing:

## Code Standards

### Required Before Each Commit
- Run tests to verify the script can execute without any errors and all routines and functions also execute error free.

### Development Flow

## Repository Structure
- `cmd/`: Main service entry points and executables
- `internal/`: Logic related to interactions with other GitHub services
- `config/`: Configuration files and templates
- `docs/`: Documentation
- `testing/`: Test helpers and fixtures

## Key Guidelines
1. Follow Microsoft Power Apps Javascript best practices and idiomatic patterns in the reference section.
2. Maintain existing code structure and organization
3. Use dependency injection patterns where appropriate
4. Write unit tests for new functionality. Use table-driven unit tests when possible.
5. Document public APIs and complex logic. Suggest changes to the `docs/` folder when appropriate

## Reference Links
 https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/script-jscript-web-resources
 
