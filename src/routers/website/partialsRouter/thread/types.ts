export enum ROUTE {
  DELETE_MODAL = "/:targetThreadId/delete-modal",
  SOURCES_MODAL = "/:targetThreadId/:targetMessageId/sources-modal",
  IMAGES_LISTING = "/:targetThreadId/:targetMessageId/:targetImageOrder/images-listing",
  IMAGE = "/:targetThreadId/:targetMessageId/:targetImageOrder/image",
  OPEN_IMAGE = "/:targetThreadId/:targetMessageId/:targetImageOrder/open-image",
}
