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
export interface FdPaginationRequestDetail {
  page: number;
  href?: string;
}

export type FdMenuOpenChangeDetail = FdOpenChangeDetail;
export type FdSelectorOpenChangeDetail = FdOpenChangeDetail;
export type FdSplitButtonOpenChangeDetail = FdOpenChangeDetail;

export type FdAlertDismissDetail = FdActionDetail;
export type FdCheckboxGroupChangeDetail = FdValuesChangeDetail;
export type FdChipRemoveDetail = FdActionDetail;
export type FdSelectorChangeDetail = FdValuesChangeDetail;
export type FdRadioGroupChangeDetail = FdValueChangeDetail;
export type FdPaginationChangeDetail = FdPaginationRequestDetail;

export type FdMenuItemSelectDetail = FdActionDetail;
export type FdSplitButtonActionDetail = FdActionDetail;
