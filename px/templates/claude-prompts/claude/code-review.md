# Code Review Prompt for {{projectName}}

## Project Context
- **Project**: {{projectName}}
- **Main Language**: {{mainLanguage}}
- **Purpose**: {{taskDescription}}

---

## Code Review Request

Please review the following {{mainLanguage}} code for the {{projectName}} project. Focus on improving readability, performance, security, and adherence to best practices.

### Review Criteria:

#### 1. **Code Quality**
- Is the code readable and well-structured?
- Are variables and functions named clearly?
- Is the code DRY (Don't Repeat Yourself)?
- Are there any code smells or anti-patterns?

#### 2. **Performance**
- Are there any obvious performance bottlenecks?
- Could any algorithms or data structures be optimized?
- Are there unnecessary computations or memory allocations?

#### 3. **Security**
- Are there any potential security vulnerabilities?
- Is input validation properly implemented?
- Are sensitive data and credentials handled securely?

#### 4. **Best Practices**
- Does the code follow {{mainLanguage}} best practices?
- Is error handling implemented correctly?
- Are there appropriate comments and documentation?

#### 5. **Testing**
- Is the code testable?
- Are edge cases considered?
- Would you recommend any specific test cases?

### Specific Focus Areas for {{projectName}}:
- {{taskDescription}} implementation quality
- Integration with existing {{projectName}} architecture
- Compliance with team coding standards
- Scalability considerations

### Output Format:

Please provide your review in the following format:

```markdown
## Code Review Summary

### ✅ Strengths
- [List what's done well]

### ⚠️ Issues Found
- **[Severity]**: [Description of issue]
  - **Location**: [File/line reference]
  - **Recommendation**: [How to fix]

### 🚀 Improvements
- [Specific suggestions for enhancement]

### 🔧 Refactoring Suggestions
- [Code structure improvements]

### 🧪 Testing Recommendations
- [Suggested test cases or testing approaches]

### 📝 Documentation Needs
- [Areas needing better documentation]

### Overall Rating: [1-10]/10
**Summary**: [Brief overall assessment]
```

---

## Code to Review:

```{{mainLanguage}}
[Paste your code here]
```

## Additional Context (if needed):
- **Related Files**: [List any related files or dependencies]
- **Use Case**: [Describe how this code is used]
- **Performance Requirements**: [Any specific performance needs]
- **Known Issues**: [Any issues you're already aware of]

---

*Generated for {{projectName}} - {{mainLanguage}} code review* 