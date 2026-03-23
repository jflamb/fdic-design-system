import {
  FormControlController,
  type FormControllerOptions,
} from "./form-control-controller.js";

// Kept as a named extension point so single-value controls can gain
// family-specific behavior without changing every consumer import.
export class SingleValueFormController extends FormControlController {
  constructor(options: FormControllerOptions) {
    super(options);
  }
}
