export interface FdOpenChangeDetail {
  open: boolean;
}

export interface FdValueChangeDetail {
  value: string;
}

export interface FdValuesChangeDetail extends FdValueChangeDetail {
  values: string[];
}

export interface FdActionDetail {}

export type FdMenuOpenChangeDetail = FdOpenChangeDetail;
export type FdSelectorOpenChangeDetail = FdOpenChangeDetail;
export type FdSplitButtonOpenChangeDetail = FdOpenChangeDetail;

export type FdAlertDismissDetail = FdActionDetail;
export type FdCheckboxGroupChangeDetail = FdValuesChangeDetail;
export type FdChipRemoveDetail = FdActionDetail;
export type FdSelectorChangeDetail = FdValuesChangeDetail;
export type FdRadioGroupChangeDetail = FdValueChangeDetail;

export type FdMenuItemSelectDetail = FdActionDetail;
export type FdSplitButtonActionDetail = FdActionDetail;
