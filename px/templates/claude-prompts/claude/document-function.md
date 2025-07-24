# Function Documentation Prompt for {{projectName}}

## Project Context
- **Project**: {{projectName}}
- **Main Language**: {{mainLanguage}}
- **Purpose**: {{taskDescription}}

---

## Documentation Request

Please generate comprehensive documentation for the following {{mainLanguage}} function(s) from the {{projectName}} project.

### Documentation Requirements:

#### 1. **Function Overview**
- Brief description of what the function does
- Primary purpose within the {{projectName}} context
- Key responsibilities and scope

#### 2. **Technical Specifications**
- Parameters and their types
- Return values and types
- Thrown exceptions or error conditions
- Side effects (if any)

#### 3. **Usage Examples**
- Basic usage example
- Advanced usage scenarios
- Common patterns for {{projectName}}
- Integration with other project components

#### 4. **Implementation Details**
- Algorithm complexity (if relevant)
- Performance characteristics
- Memory usage considerations
- Concurrency/thread safety notes

### Documentation Standard for {{projectName}}:

Please follow this format:

```{{mainLanguage}}
/**
 * [Brief description of function purpose]
 * 
 * [Detailed description explaining what the function does,
 *  why it exists, and how it fits into {{projectName}}]
 * 
 * @param {type} paramName - [Description of parameter and constraints]
 * @param {type} [optionalParam] - [Description of optional parameter]
 * @returns {type} [Description of return value and possible states]
 * @throws {ErrorType} [When and why this error is thrown]
 * 
 * @example
 * // Basic usage
 * const result = functionName(param1, param2);
 * 
 * @example  
 * // Advanced usage for {{projectName}}
 * const advancedResult = functionName(
 *   complexParam,
 *   { option: 'value' }
 * );
 * 
 * @since 1.0.0
 * @see {@link RelatedFunction} for related functionality
 * @see {@link https://docs.{{projectName}}.com} for more details
 */
```

### Additional Documentation Elements:

#### For Complex Functions:
- **Algorithm Explanation**: Step-by-step breakdown
- **Data Flow**: How data moves through the function
- **Dependencies**: What external functions/services are used
- **Assumptions**: What the function assumes about inputs

#### For Public APIs:
- **Backward Compatibility**: Version compatibility notes
- **Migration Guide**: How to upgrade from older versions
- **Rate Limits**: If applicable to {{projectName}}
- **Authentication**: Required permissions or tokens

#### For Performance-Critical Functions:
- **Time Complexity**: Big O notation
- **Space Complexity**: Memory usage patterns
- **Optimization Notes**: Performance tuning suggestions
- **Benchmarks**: Typical execution times

### Project-Specific Context for {{projectName}}:

Please consider these aspects specific to {{projectName}}:

- **Domain Logic**: {{taskDescription}}
- **Architecture Patterns**: How this function fits into the overall system
- **Error Handling**: Consistent with {{projectName}} error patterns
- **Logging**: What should be logged for debugging
- **Testing**: Key test cases that should be covered

### Output Format:

```markdown
## Function Documentation

### 📋 Overview
[High-level description of the function]

### 🔧 Implementation
[Detailed technical documentation with JSDoc comments]

### 💡 Usage Examples

#### Basic Usage:
```{{mainLanguage}}
[Simple example]
```

#### Advanced Usage:
```{{mainLanguage}}
[Complex example relevant to {{projectName}}]
```

#### Integration Example:
```{{mainLanguage}}
[How it works with other {{projectName}} components]
```

### ⚠️ Important Notes
- [Critical information about usage]
- [Performance considerations]
- [Security implications]

### 🧪 Testing Considerations
- [Key test cases]
- [Edge cases to consider]
- [Mock requirements]

### 📚 Related Functions
- [List of related functions with brief descriptions]
```

---

## Function(s) to Document:

```{{mainLanguage}}
[Paste your function(s) here]
```

## Additional Context:

### Function Purpose:
[Explain what this function is supposed to achieve in {{projectName}}]

### Usage Context:
[Describe where and how this function is typically used]

### Known Issues or Limitations:
[Any current limitations or known issues]

### Related Business Logic:
[Any business rules or domain logic that affects this function]

---

*Documentation request for {{projectName}} - {{mainLanguage}} function documentation*

**Documentation Level**: [Basic / Detailed / Comprehensive]
**Audience**: [Developers / End Users / API Consumers] 