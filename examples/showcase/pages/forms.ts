import { defineComponent, h, renderComponent } from "../../../mod.ts";

// Define the forms page component
defineComponent("showcase-forms", {
  render: () => h("div", {}, [
    h("header", { class: "hero" }, [
      h("h1", { style: "font-size: var(--font-size-6); margin: var(--size-3) 0;" }, "Forms & Validation"),
      h("p", { style: "font-size: var(--font-size-2); color: var(--text-2);" }, 
        "Build interactive forms with real-time validation using declarative bindings")
    ]),
    
    // Simple Form Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Basic Form with Validation"),
      h("p", {}, "A complete form with real-time validation and submission handling"),
      h("div", { class: "demo-example" }, [
        h("div", { class: "form-container" }, [
          h("form", { 
            id: "basic-form",
            "data-listen": "validate-field:validateField(),submit-form:submitForm()",
            style: "max-width: 500px;"
          }, [
            // Name Field
            h("div", { class: "field-group" }, [
              h("label", { 
                for: "name",
                style: "display: block; margin-bottom: var(--size-1); font-weight: 500;"
              }, "Full Name *"),
              h("input", {
                type: "text",
                id: "name",
                name: "name",
                "data-bind-value": "formData.name",
                "data-emit": "validate-field",
                "data-emit-value": '{"field": "name"}',
                placeholder: "Enter your full name",
                required: "true",
                style: `
                  width: 100%;
                  padding: var(--size-2);
                  border: 1px solid var(--surface-3);
                  border-radius: var(--radius-1);
                  font-size: var(--font-size-0);
                `
              }),
              h("div", { 
                id: "name-error",
                "data-show-if": "errors.name",
                class: "field-error"
              }, [
                h("span", { "data-bind-text": "errors.name" }, "")
              ])
            ]),
            
            // Email Field
            h("div", { class: "field-group" }, [
              h("label", { 
                for: "email",
                style: "display: block; margin-bottom: var(--size-1); font-weight: 500;"
              }, "Email Address *"),
              h("input", {
                type: "email",
                id: "email", 
                name: "email",
                "data-bind-value": "formData.email",
                "data-emit": "validate-field",
                "data-emit-value": '{"field": "email"}',
                placeholder: "Enter your email",
                required: "true",
                style: `
                  width: 100%;
                  padding: var(--size-2);
                  border: 1px solid var(--surface-3);
                  border-radius: var(--radius-1);
                  font-size: var(--font-size-0);
                `
              }),
              h("div", { 
                id: "email-error",
                "data-show-if": "errors.email",
                class: "field-error"
              }, [
                h("span", { "data-bind-text": "errors.email" }, "")
              ])
            ]),
            
            // Phone Field
            h("div", { class: "field-group" }, [
              h("label", { 
                for: "phone",
                style: "display: block; margin-bottom: var(--size-1); font-weight: 500;"
              }, "Phone Number"),
              h("input", {
                type: "tel",
                id: "phone",
                name: "phone", 
                "data-bind-value": "formData.phone",
                "data-emit": "validate-field",
                "data-emit-value": '{"field": "phone"}',
                placeholder: "(555) 123-4567",
                style: `
                  width: 100%;
                  padding: var(--size-2);
                  border: 1px solid var(--surface-3);
                  border-radius: var(--radius-1);
                  font-size: var(--font-size-0);
                `
              }),
              h("div", { 
                id: "phone-error",
                "data-show-if": "errors.phone",
                class: "field-error"
              }, [
                h("span", { "data-bind-text": "errors.phone" }, "")
              ])
            ]),
            
            // Message Field
            h("div", { class: "field-group" }, [
              h("label", { 
                for: "message",
                style: "display: block; margin-bottom: var(--size-1); font-weight: 500;"
              }, "Message *"),
              h("textarea", {
                id: "message",
                name: "message",
                "data-bind-value": "formData.message",
                "data-emit": "validate-field", 
                "data-emit-value": '{"field": "message"}',
                placeholder: "Tell us what you're thinking...",
                required: "true",
                rows: "4",
                style: `
                  width: 100%;
                  padding: var(--size-2);
                  border: 1px solid var(--surface-3);
                  border-radius: var(--radius-1);
                  font-size: var(--font-size-0);
                  resize: vertical;
                `
              }),
              h("div", { 
                id: "message-error",
                "data-show-if": "errors.message",
                class: "field-error"
              }, [
                h("span", { "data-bind-text": "errors.message" }, "")
              ])
            ]),
            
            // Submit Button
            h("div", { class: "field-group" }, [
              h("button", {
                type: "button",
                "data-emit": "submit-form",
                "data-emit-value": "{}",
                style: `
                  width: 100%;
                  padding: var(--size-3) var(--size-4);
                  background: var(--brand);
                  color: white;
                  border: none;
                  border-radius: var(--radius-1);
                  font-size: var(--font-size-0);
                  font-weight: 500;
                  cursor: pointer;
                  transition: background 0.2s ease;
                `
              }, "Submit Form"),
              h("div", { 
                id: "form-success",
                "data-show-if": "form.submitted",
                class: "success-message"
              }, "✅ Form submitted successfully!")
            ])
          ])
        ]),
        createCodeExample(`<!-- Form with validation bindings -->
<form data-listen="validate-field:validateField(),submit-form:submitForm()">
  
  <!-- Input field with validation -->
  <input 
    data-bind-value="formData.name"
    data-emit="validate-field" 
    data-emit-value='{"field": "name"}'
    required
  />
  
  <!-- Error display -->
  <div data-show-if="errors.name" class="field-error">
    <span data-bind-text="errors.name"></span>
  </div>
  
  <!-- Submit button -->
  <button data-emit="submit-form">Submit Form</button>
  
  <!-- Success message -->
  <div data-show-if="form.submitted" class="success-message">
    Form submitted successfully!
  </div>
  
</form>`)
      ])
    ]),
    
    // Multi-Step Form Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Multi-Step Form"),
      h("p", {}, "Navigate through form steps with progress indication"),
      h("div", { class: "demo-example" }, [
        h("div", { class: "multistep-form" }, [
          // Progress Indicator
          h("div", { class: "progress-steps" }, [
            h("div", { 
              class: "step active",
              "data-bind-class": "steps.step1"
            }, [
              h("div", { class: "step-number" }, "1"),
              h("div", { class: "step-title" }, "Personal")
            ]),
            h("div", { class: "step-connector" }),
            h("div", { 
              class: "step",
              "data-bind-class": "steps.step2"
            }, [
              h("div", { class: "step-number" }, "2"),
              h("div", { class: "step-title" }, "Preferences")
            ]),
            h("div", { class: "step-connector" }),
            h("div", { 
              class: "step",
              "data-bind-class": "steps.step3"
            }, [
              h("div", { class: "step-number" }, "3"),
              h("div", { class: "step-title" }, "Review")
            ])
          ]),
          
          // Step Content
          h("div", { 
            class: "step-content",
            "data-listen": "next-step:nextStep(),prev-step:prevStep(),finish-form:finishForm()"
          }, [
            // Step 1: Personal Info
            h("div", { 
              "data-show-if": "currentStep.step1",
              class: "step-panel"
            }, [
              h("h3", {}, "Personal Information"),
              h("div", { class: "field-group" }, [
                h("label", {}, "First Name"),
                h("input", { 
                  type: "text",
                  "data-bind-value": "multiForm.firstName",
                  placeholder: "John"
                })
              ]),
              h("div", { class: "field-group" }, [
                h("label", {}, "Last Name"), 
                h("input", { 
                  type: "text",
                  "data-bind-value": "multiForm.lastName",
                  placeholder: "Doe"
                })
              ]),
              h("div", { class: "field-group" }, [
                h("label", {}, "Age"),
                h("input", { 
                  type: "number",
                  "data-bind-value": "multiForm.age",
                  placeholder: "25",
                  min: "1",
                  max: "120"
                })
              ]),
              h("div", { class: "step-actions" }, [
                h("button", { 
                  "data-emit": "next-step",
                  "data-emit-value": "{}",
                  class: "btn primary"
                }, "Next →")
              ])
            ]),
            
            // Step 2: Preferences
            h("div", { 
              "data-show-if": "currentStep.step2",
              class: "step-panel"
            }, [
              h("h3", {}, "Preferences"),
              h("div", { class: "field-group" }, [
                h("label", {}, "Favorite Color"),
                h("select", { "data-bind-value": "multiForm.color" }, [
                  h("option", { value: "" }, "Choose a color"),
                  h("option", { value: "blue" }, "Blue"),
                  h("option", { value: "green" }, "Green"),
                  h("option", { value: "red" }, "Red"),
                  h("option", { value: "purple" }, "Purple")
                ])
              ]),
              h("div", { class: "field-group" }, [
                h("label", {}, "Interests"),
                h("div", { class: "checkbox-group" }, [
                  h("label", { class: "checkbox-label" }, [
                    h("input", { 
                      type: "checkbox",
                      "data-bind-value": "multiForm.interests.tech"
                    }),
                    " Technology"
                  ]),
                  h("label", { class: "checkbox-label" }, [
                    h("input", { 
                      type: "checkbox",
                      "data-bind-value": "multiForm.interests.sports"
                    }),
                    " Sports"
                  ]),
                  h("label", { class: "checkbox-label" }, [
                    h("input", { 
                      type: "checkbox",
                      "data-bind-value": "multiForm.interests.music"
                    }),
                    " Music"
                  ])
                ])
              ]),
              h("div", { class: "step-actions" }, [
                h("button", { 
                  "data-emit": "prev-step",
                  "data-emit-value": "{}",
                  class: "btn secondary"
                }, "← Back"),
                h("button", { 
                  "data-emit": "next-step",
                  "data-emit-value": "{}",
                  class: "btn primary"
                }, "Next →")
              ])
            ]),
            
            // Step 3: Review
            h("div", { 
              "data-show-if": "currentStep.step3",
              class: "step-panel"
            }, [
              h("h3", {}, "Review & Submit"),
              h("div", { class: "review-section" }, [
                h("h4", {}, "Personal Information"),
                h("p", {}, [
                  "Name: ",
                  h("span", { "data-bind-text": "multiForm.firstName" }, ""), 
                  " ",
                  h("span", { "data-bind-text": "multiForm.lastName" }, "")
                ]),
                h("p", {}, [
                  "Age: ",
                  h("span", { "data-bind-text": "multiForm.age" }, "")
                ]),
                
                h("h4", {}, "Preferences"),
                h("p", {}, [
                  "Favorite Color: ",
                  h("span", { "data-bind-text": "multiForm.color" }, "")
                ]),
                h("p", {}, "Interests: Technology, Sports, Music")
              ]),
              h("div", { class: "step-actions" }, [
                h("button", { 
                  "data-emit": "prev-step",
                  "data-emit-value": "{}",
                  class: "btn secondary"
                }, "← Back"),
                h("button", { 
                  "data-emit": "finish-form",
                  "data-emit-value": "{}",
                  class: "btn success"
                }, "Complete!")
              ])
            ]),
            
            // Completion Message
            h("div", { 
              "data-show-if": "form.completed",
              class: "completion-message"
            }, [
              h("h3", {}, "🎉 All Done!"),
              h("p", {}, "Your multi-step form has been completed successfully."),
              h("button", { 
                onclick: "location.reload()",
                class: "btn primary"
              }, "Start Over")
            ])
          ])
        ]),
        createCodeExample(`<!-- Multi-step form with progress -->
<div class="progress-steps">
  <div class="step" data-bind-class="steps.step1">
    <div class="step-number">1</div>
    <div class="step-title">Personal</div>
  </div>
  <!-- More steps... -->
</div>

<div data-listen="next-step:nextStep(),prev-step:prevStep()">
  <!-- Step 1 -->
  <div data-show-if="currentStep.step1">
    <input data-bind-value="multiForm.firstName" />
    <button data-emit="next-step">Next →</button>
  </div>
  
  <!-- Step 2 -->
  <div data-show-if="currentStep.step2">
    <select data-bind-value="multiForm.color">...</select>
    <button data-emit="prev-step">← Back</button>
    <button data-emit="next-step">Next →</button>
  </div>
  
  <!-- Step 3 -->
  <div data-show-if="currentStep.step3">
    <p>Name: <span data-bind-text="multiForm.firstName"></span></p>
    <button data-emit="finish-form">Complete!</button>
  </div>
</div>`)
      ])
    ]),
    
    // Dynamic Form Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Dynamic Form Builder"),
      h("p", {}, "Add and remove form fields dynamically"),
      h("div", { class: "demo-example" }, [
        h("div", { class: "dynamic-form" }, [
          h("div", { 
            class: "field-controls",
            "data-listen": "add-field:addField(),remove-field:removeField()"
          }, [
            h("button", { 
              "data-emit": "add-field",
              "data-emit-value": '{"type": "text"}',
              class: "btn secondary"
            }, "+ Add Text Field"),
            h("button", { 
              "data-emit": "add-field",
              "data-emit-value": '{"type": "email"}',
              class: "btn secondary"
            }, "+ Add Email Field"),
            h("button", { 
              "data-emit": "add-field",
              "data-emit-value": '{"type": "textarea"}',
              class: "btn secondary"
            }, "+ Add Textarea")
          ]),
          
          h("div", { 
            id: "dynamic-fields",
            class: "dynamic-fields"
          }, [
            h("div", { class: "dynamic-field" }, [
              h("label", {}, "Name (required)"),
              h("input", { 
                type: "text",
                placeholder: "Your name",
                required: "true"
              }),
              h("button", { 
                class: "remove-btn",
                onclick: "this.parentElement.remove()",
                disabled: "true"
              }, "×")
            ])
          ])
        ]),
        createCodeExample(`<!-- Dynamic field management -->
<div data-listen="add-field:addField(),remove-field:removeField()">
  
  <!-- Control buttons -->
  <button data-emit="add-field" data-emit-value='{"type": "text"}'>
    + Add Text Field
  </button>
  <button data-emit="add-field" data-emit-value='{"type": "email"}'>
    + Add Email Field
  </button>
  
  <!-- Dynamic field container -->
  <div id="dynamic-fields">
    <!-- Fields will be added here dynamically -->
  </div>
  
</div>

<!-- JavaScript handles adding/removing fields -->
function addField(event) {
  const { type } = event.detail;
  const fieldsContainer = document.getElementById('dynamic-fields');
  // Create and append new field based on type
}`)
      ])
    ])
  ])
});

function createCodeExample(code: string) {
  return h("details", { 
    class: "code-example",
    style: "margin-top: var(--size-3);"
  }, [
    h("summary", { 
      style: "cursor: pointer; font-size: var(--font-size-0); color: var(--text-2); padding: var(--size-1);"
    }, "💻 View Code"),
    h("pre", { 
      style: `
        margin: var(--size-2) 0 0 0;
        font-size: var(--font-size-0);
        background: var(--gray-9);
        color: var(--gray-0);
        padding: var(--size-3);
        border-radius: var(--radius-1);
        overflow-x: auto;
        line-height: 1.5;
      `
    }, code)
  ]);
}

export function createFormsPage(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Forms - ui-lib Showcase</title>
      <link rel="stylesheet" href="/css/styles.css">
      <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    </head>
    <body>
      <nav>
        <ul>
          <li><strong>ui-lib</strong></li>
          <li><a href="/">Home</a></li>
          <li><a href="/components">Components</a></li>
          <li><a href="/reactivity">Reactivity</a></li>
          <li><a href="/forms" class="active">Forms</a></li>
          <li><a href="/layouts">Layouts</a></li>
        </ul>
      </nav>
      <div class="container">
        ${renderComponent("showcase-forms")}
      </div>
      
      <style>
        .demo-example {
          margin: var(--size-4) 0;
          padding: var(--size-4);
          background: var(--surface-1);
          border-radius: var(--radius-2);
          border: 1px solid var(--surface-3);
        }
        
        .form-container {
          display: flex;
          justify-content: center;
        }
        
        .field-group {
          margin-bottom: var(--size-4);
        }
        
        .field-group:last-child {
          margin-bottom: 0;
        }
        
        .field-error {
          color: #dc3545;
          font-size: var(--font-size-0);
          margin-top: var(--size-1);
        }
        
        .success-message {
          color: #28a745;
          font-weight: 500;
          text-align: center;
          padding: var(--size-2);
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: var(--radius-1);
          margin-top: var(--size-3);
        }
        
        /* Multi-step form styles */
        .multistep-form {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .progress-steps {
          display: flex;
          align-items: center;
          margin-bottom: var(--size-6);
        }
        
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          text-align: center;
        }
        
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--surface-3);
          color: var(--text-2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: var(--size-1);
        }
        
        .step.active .step-number {
          background: var(--brand);
          color: white;
        }
        
        .step.completed .step-number {
          background: #28a745;
          color: white;
        }
        
        .step-title {
          font-size: var(--font-size-0);
          color: var(--text-2);
        }
        
        .step.active .step-title {
          color: var(--brand);
          font-weight: 500;
        }
        
        .step-connector {
          flex: 1;
          height: 2px;
          background: var(--surface-3);
          margin: 0 var(--size-2);
          margin-bottom: var(--size-5);
        }
        
        .step-panel {
          background: var(--surface-2);
          padding: var(--size-4);
          border-radius: var(--radius-2);
          margin-bottom: var(--size-4);
        }
        
        .step-actions {
          display: flex;
          justify-content: space-between;
          margin-top: var(--size-4);
        }
        
        .step-actions .btn {
          padding: var(--size-2) var(--size-4);
          border: none;
          border-radius: var(--radius-1);
          cursor: pointer;
          font-size: var(--font-size-0);
        }
        
        .btn.primary {
          background: var(--brand);
          color: white;
        }
        
        .btn.secondary {
          background: var(--surface-3);
          color: var(--text-1);
        }
        
        .btn.success {
          background: #28a745;
          color: white;
        }
        
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: var(--size-2);
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          font-weight: normal;
          margin-bottom: 0;
        }
        
        .review-section h4 {
          margin-top: var(--size-3);
          margin-bottom: var(--size-2);
          color: var(--brand);
        }
        
        .review-section h4:first-child {
          margin-top: 0;
        }
        
        .completion-message {
          text-align: center;
          padding: var(--size-6);
          background: var(--surface-2);
          border-radius: var(--radius-2);
        }
        
        /* Dynamic form styles */
        .dynamic-form {
          max-width: 500px;
          margin: 0 auto;
        }
        
        .field-controls {
          display: flex;
          gap: var(--size-2);
          margin-bottom: var(--size-4);
          flex-wrap: wrap;
        }
        
        .field-controls .btn {
          padding: var(--size-1) var(--size-2);
          font-size: var(--font-size-0);
          border: none;
          border-radius: var(--radius-1);
          cursor: pointer;
        }
        
        .dynamic-field {
          display: flex;
          align-items: center;
          gap: var(--size-2);
          padding: var(--size-2);
          background: var(--surface-2);
          border-radius: var(--radius-1);
          margin-bottom: var(--size-2);
        }
        
        .dynamic-field label {
          min-width: 120px;
          margin-bottom: 0;
        }
        
        .dynamic-field input,
        .dynamic-field textarea {
          flex: 1;
          padding: var(--size-1);
          border: 1px solid var(--surface-3);
          border-radius: var(--radius-1);
        }
        
        .remove-btn {
          width: 30px;
          height: 30px;
          border: none;
          background: #dc3545;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .remove-btn:disabled {
          background: var(--surface-3);
          color: var(--text-2);
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .step-actions {
            flex-direction: column;
            gap: var(--size-2);
          }
          
          .field-controls {
            justify-content: center;
          }
          
          .dynamic-field {
            flex-direction: column;
            align-items: stretch;
          }
          
          .dynamic-field label {
            min-width: auto;
          }
        }
      </style>
      
      <script>
        // Form validation state
        const formData = {
          name: '',
          email: '',
          phone: '',
          message: ''
        };
        
        const errors = {};
        
        // Multi-step form state
        let currentStepIndex = 1;
        const multiFormData = {
          firstName: '',
          lastName: '',
          age: '',
          color: '',
          interests: {
            tech: false,
            sports: false,
            music: false
          }
        };
        
        // Initialize state
        document.addEventListener('DOMContentLoaded', () => {
          // Basic form state
          Object.keys(formData).forEach(field => {
            document.dispatchEvent(new CustomEvent(\`ui-lib:formData.\${field}\`, { 
              detail: { data: formData[field] } 
            }));
          });
          
          // Multi-step form state
          updateStepState();
          
          // Initialize multi-form data
          Object.keys(multiFormData).forEach(field => {
            if (typeof multiFormData[field] === 'object') {
              Object.keys(multiFormData[field]).forEach(subField => {
                document.dispatchEvent(new CustomEvent(\`ui-lib:multiForm.\${field}.\${subField}\`, { 
                  detail: { data: multiFormData[field][subField] } 
                }));
              });
            } else {
              document.dispatchEvent(new CustomEvent(\`ui-lib:multiForm.\${field}\`, { 
                detail: { data: multiFormData[field] } 
              }));
            }
          });
          
          // Other state
          document.dispatchEvent(new CustomEvent('ui-lib:form.submitted', { 
            detail: { data: false } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:form.completed', { 
            detail: { data: false } 
          }));
        });
        
        // Validation functions
        function validateField(event) {
          const { field } = event.detail;
          const value = document.getElementById(field)?.value || '';
          let error = '';
          
          switch (field) {
            case 'name':
              if (!value.trim()) error = 'Name is required';
              else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
              break;
              
            case 'email':
              if (!value.trim()) error = 'Email is required';
              else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) error = 'Please enter a valid email';
              break;
              
            case 'phone':
              if (value && !/^[\\d\\s\\(\\)\\-\\+]+$/.test(value)) error = 'Please enter a valid phone number';
              break;
              
            case 'message':
              if (!value.trim()) error = 'Message is required';
              else if (value.trim().length < 10) error = 'Message must be at least 10 characters';
              break;
          }
          
          errors[field] = error;
          
          // Update error state
          document.dispatchEvent(new CustomEvent(\`ui-lib:errors.\${field}\`, { 
            detail: { data: error } 
          }));
        }
        
        function submitForm(event) {
          // Validate all fields
          ['name', 'email', 'message'].forEach(field => {
            validateField({ detail: { field } });
          });
          
          // Check if form is valid
          const hasErrors = Object.values(errors).some(error => error);
          
          if (!hasErrors) {
            // Simulate form submission
            setTimeout(() => {
              document.dispatchEvent(new CustomEvent('ui-lib:form.submitted', { 
                detail: { data: true } 
              }));
            }, 500);
          } else {
            alert('Please fix the errors before submitting');
          }
        }
        
        // Multi-step form functions
        function updateStepState() {
          // Update step classes
          document.dispatchEvent(new CustomEvent('ui-lib:steps.step1', { 
            detail: { data: currentStepIndex === 1 ? 'active' : (currentStepIndex > 1 ? 'completed' : '') } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:steps.step2', { 
            detail: { data: currentStepIndex === 2 ? 'active' : (currentStepIndex > 2 ? 'completed' : '') } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:steps.step3', { 
            detail: { data: currentStepIndex === 3 ? 'active' : (currentStepIndex > 3 ? 'completed' : '') } 
          }));
          
          // Update current step visibility
          document.dispatchEvent(new CustomEvent('ui-lib:currentStep.step1', { 
            detail: { data: currentStepIndex === 1 } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:currentStep.step2', { 
            detail: { data: currentStepIndex === 2 } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:currentStep.step3', { 
            detail: { data: currentStepIndex === 3 } 
          }));
        }
        
        function nextStep() {
          if (currentStepIndex < 3) {
            currentStepIndex++;
            updateStepState();
          }
        }
        
        function prevStep() {
          if (currentStepIndex > 1) {
            currentStepIndex--;
            updateStepState();
          }
        }
        
        function finishForm() {
          document.dispatchEvent(new CustomEvent('ui-lib:form.completed', { 
            detail: { data: true } 
          }));
        }
        
        // Dynamic form functions
        let fieldCounter = 1;
        
        function addField(event) {
          const { type } = event.detail;
          const fieldsContainer = document.getElementById('dynamic-fields');
          fieldCounter++;
          
          const fieldDiv = document.createElement('div');
          fieldDiv.className = 'dynamic-field';
          
          let fieldHtml = '';
          const fieldId = \`field-\${fieldCounter}\`;
          
          switch (type) {
            case 'text':
              fieldHtml = \`
                <label for="\${fieldId}">Text Field \${fieldCounter}</label>
                <input type="text" id="\${fieldId}" placeholder="Enter text..." />
                <button class="remove-btn" onclick="this.parentElement.remove()">×</button>
              \`;
              break;
              
            case 'email':
              fieldHtml = \`
                <label for="\${fieldId}">Email Field \${fieldCounter}</label>
                <input type="email" id="\${fieldId}" placeholder="Enter email..." />
                <button class="remove-btn" onclick="this.parentElement.remove()">×</button>
              \`;
              break;
              
            case 'textarea':
              fieldHtml = \`
                <label for="\${fieldId}">Textarea \${fieldCounter}</label>
                <textarea id="\${fieldId}" placeholder="Enter text..." rows="3"></textarea>
                <button class="remove-btn" onclick="this.parentElement.remove()">×</button>
              \`;
              break;
          }
          
          fieldDiv.innerHTML = fieldHtml;
          fieldsContainer.appendChild(fieldDiv);
        }
        
        // Global functions for data-listen attributes
        window.validateField = validateField;
        window.submitForm = submitForm;
        window.nextStep = nextStep;
        window.prevStep = prevStep;
        window.finishForm = finishForm;
        window.addField = addField;
      </script>
    </body>
    </html>
  `;
}