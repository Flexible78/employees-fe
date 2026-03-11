# Updating Employee Flow
## EditEmployee component
### View
Icon Button with "editting" view
### Logic
- Hitting the Icon Button triggers appearing Modal Dialog with EmployeeForm intended for updating the given employee<br>
- After submitting the form, define which fields have been updated<br>
-Only in the case there has been update of any updatable fields, create appropriate Updater object and mutate that object but mutation function calling updateEmployee method of ApiClient
### Requirement
Icon button should be disabled during mutation process



