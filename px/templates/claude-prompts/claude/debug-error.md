# Error Debugging Prompt for {{projectName}}

## Project Context
- **Project**: {{projectName}}
- **Main Language**: {{mainLanguage}}
- **Purpose**: {{taskDescription}}

---

## Debug Request

I'm encountering an error in my {{mainLanguage}} code for the {{projectName}} project. Please help me identify the root cause and provide a solution.

### Error Information:

#### 1. **Error Message**
```
[Paste the exact error message here]
```

#### 2. **Error Type**
- [ ] Runtime Error
- [ ] Compilation Error
- [ ] Logic Error
- [ ] Performance Issue
- [ ] Integration Error
- [ ] Other: ___________

#### 3. **Context**
- **When does it occur?**: [Describe when the error happens]
- **Frequency**: [Always / Sometimes / Rarely]
- **Environment**: [Development / Testing / Production]
- **Recent Changes**: [Any recent code changes that might be related]

### Code Causing the Issue:

```{{mainLanguage}}
[Paste the problematic code here]
```

### Stack Trace (if available):
```
[Paste the full stack trace here]
```

### Expected vs Actual Behavior:

#### Expected:
[Describe what should happen]

#### Actual:
[Describe what actually happens]

### Environment Details:
- **{{mainLanguage}} Version**: [Version]
- **Operating System**: [OS and version]
- **Dependencies**: [Relevant package versions]
- **Database/External Services**: [If applicable]

### Debugging Steps Already Tried:
- [ ] Checked documentation
- [ ] Searched for similar issues online
- [ ] Added console.log/print statements
- [ ] Checked variable values
- [ ] Tested with different inputs
- [ ] Other: ___________

### Analysis Request:

Please provide:

#### 1. **Root Cause Analysis**
- What is causing this error?
- Why is it happening in this specific context?

#### 2. **Step-by-Step Solution**
- How can I fix this issue?
- What changes need to be made to the code?

#### 3. **Prevention Strategies**
- How can I prevent similar errors in the future?
- What best practices should I follow?

#### 4. **Code Improvements**
- Are there any general improvements you'd suggest for this code?
- How can I make it more robust?

### Preferred Solution Format:

```markdown
## 🔍 Root Cause
[Explanation of what's causing the error]

## 🛠️ Solution
[Step-by-step fix with code examples]

## 🔧 Improved Code
```{{mainLanguage}}
[Corrected/improved version of the code]
```

## 🛡️ Prevention
[Best practices to avoid similar issues]

## 📋 Testing Recommendations
[How to test the fix and prevent regressions]
```

### Additional Context for {{projectName}}:
- **Project Architecture**: [Brief description of your project structure]
- **Key Dependencies**: [Important libraries or frameworks used]
- **Business Logic**: [Relevant business rules or constraints]
- **Performance Requirements**: [Any specific performance needs]

---

## Related Code (if helpful):

### Configuration:
```{{mainLanguage}}
[Any relevant configuration code]
```

### Dependencies/Imports:
```{{mainLanguage}}
[Relevant imports or dependencies]
```

### Test Cases:
```{{mainLanguage}}
[Any relevant test cases that might help understand the expected behavior]
```

---

*Debug request for {{projectName}} - {{mainLanguage}} error resolution*

**Priority**: [High / Medium / Low]
**Impact**: [Critical / Major / Minor] 