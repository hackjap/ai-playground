# Code Refactoring Rules for {{projectName}}

## Context
Project: {{projectName}}  
Main Language: {{mainLanguage}}  
Purpose: {{taskDescription}}

## Refactoring Guidelines

### 1. Clean Code Principles
- **Single Responsibility**: Each function/class should have one reason to change
- **DRY (Don't Repeat Yourself)**: Eliminate code duplication
- **KISS (Keep It Simple, Stupid)**: Choose the simplest solution that works
- **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until needed

### 2. Function Refactoring Rules
- **Length**: Keep functions under 20 lines (prefer under 10)
- **Parameters**: Maximum 3 parameters (use objects for more)
- **Nesting**: Maximum 3 levels of indentation
- **Return Early**: Use early returns to reduce complexity

### 3. Variable and Naming
- **Intention-Revealing Names**: Variables should explain their purpose
- **Avoid Abbreviations**: Use full words unless well-known (URL, API)
- **Constants**: Extract magic numbers to named constants
- **Boolean Names**: Use `is`, `has`, `can`, `should` prefixes

### 4. Code Structure Improvements
- **Extract Methods**: Break down complex functions
- **Extract Classes**: Group related data and behavior
- **Remove Dead Code**: Delete unused code immediately
- **Consolidate Conditionals**: Simplify complex if-else chains

### 5. {{mainLanguage}}-Specific Refactoring

#### Performance Optimizations:
- Use appropriate data structures for the use case
- Minimize object creation in loops
- Cache expensive computations
- Prefer immutable operations where possible

#### Error Handling:
- Use proper exception handling patterns
- Fail fast with clear error messages
- Log errors with sufficient context
- Handle errors at appropriate levels

### 6. Refactoring Checklist

Before refactoring:
- [ ] All tests are passing
- [ ] Code is under version control
- [ ] Understand the current behavior completely

During refactoring:
- [ ] Make one change at a time
- [ ] Run tests after each change
- [ ] Maintain existing functionality
- [ ] Improve readability and maintainability

After refactoring:
- [ ] All tests still pass
- [ ] Code coverage hasn't decreased
- [ ] Performance hasn't degraded
- [ ] Code review with team members

### 7. AI Refactoring Prompts

Use these prompts for effective refactoring:
- "Refactor this {{mainLanguage}} function to improve readability and maintainability"
- "Extract common patterns into reusable functions"
- "Simplify this complex conditional logic"
- "Optimize this code for better performance while maintaining readability"
- "Apply SOLID principles to this class structure"

### 8. Common Refactoring Patterns

#### Extract Method:
```{{mainLanguage}}
// Before: Long function with multiple responsibilities
// After: Smaller functions with single responsibilities
```

#### Replace Magic Numbers:
```{{mainLanguage}}
// Before: if (status === 404)
// After: if (status === HTTP_STATUS.NOT_FOUND)
```

#### Simplify Conditionals:
```{{mainLanguage}}
// Before: Complex nested if-else
// After: Early returns or switch statements
```

### 9. Code Quality Metrics
- **Cyclomatic Complexity**: Keep under 10
- **Function Length**: Under 20 lines
- **Class Size**: Under 300 lines
- **Parameter Count**: Under 4 parameters

---
*Refactoring guidelines for {{projectName}} - {{taskDescription}}* 