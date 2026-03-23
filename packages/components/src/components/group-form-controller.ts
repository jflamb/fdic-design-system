import {
  FormControlController,
  type FormControllerOptions,
} from "./form-control-controller.js";

// Kept as a named extension point so grouped controls can share future
// blur/aggregation behavior behind a stable import surface.
export class GroupFormController extends FormControlController {
  constructor(options: FormControllerOptions) {
    super(options);
  }
}
