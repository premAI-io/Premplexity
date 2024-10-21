export enum ROUTE {
  CREATE = "/create",
  DELETE = "/:targetThreadId/delete",
  SEND_MESSAGE = "/:targetThreadId/sendMessage",
  RETRY = "/:targetThreadId/retry",
  EDIT_MESSAGE = "/:targetThreadId/editMessage",
  SHARE = "/:targetThreadId/share",
}
