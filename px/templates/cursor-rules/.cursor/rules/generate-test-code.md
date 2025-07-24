# Test Code Generation Rules for {{projectName}}

## Context
Project: {{projectName}}  
Main Language: {{mainLanguage}}  
Purpose: {{taskDescription}}

## Test Code Generation Guidelines

### 1. Test Structure
- Follow the **AAA pattern** (Arrange, Act, Assert)
- Use descriptive test names: `should_[expected_behavior]_when_[condition]`
- Group related tests using `describe` blocks
- Keep each test focused on a single behavior

### 2. Test Coverage Requirements
- **Unit Tests**: Cover all public methods and edge cases
- **Integration Tests**: Test component interactions
- **Error Handling**: Test both success and failure scenarios
- Target minimum 80% code coverage

### 3. Code Quality Standards
- **Mocking**: Use mocks for external dependencies
- **Data**: Use factory patterns for test data creation
- **Assertions**: Prefer specific assertions over generic ones
- **Cleanup**: Always clean up resources in teardown

### 4. Language-Specific Guidelines

#### For {{mainLanguage}} Projects:
- Use appropriate testing framework (Jest, Vitest, etc.)
- Follow {{mainLanguage}} naming conventions
- Include type safety in tests where applicable
- Mock external APIs and database calls

### 5. Example Test Template

```{{mainLanguage}}
describe('{{projectName}} - [FeatureName]', () => {
  describe('when [specific condition]', () => {
    it('should [expected behavior]', async () => {
      // Arrange
      const input = createTestData();
      const mockDependency = jest.fn();
      
      // Act
      const result = await functionUnderTest(input, mockDependency);
      
      // Assert
      expect(result).toEqual(expectedOutput);
      expect(mockDependency).toHaveBeenCalledWith(expectedArgs);
    });
  });
});
```

### 6. AI Generation Prompts

When generating tests, use these prompts:
- "Generate comprehensive unit tests for this {{mainLanguage}} function"
- "Create integration tests that cover the main user flows"
- "Add edge case tests for error scenarios and boundary conditions"
- "Include performance tests for critical path functions"

### 7. Best Practices
- **Test Independence**: Each test should run independently
- **Readability**: Tests serve as documentation
- **Maintenance**: Keep tests simple and maintainable
- **Speed**: Optimize for fast execution in CI/CD

---
*Generated for {{projectName}} - {{taskDescription}}* 