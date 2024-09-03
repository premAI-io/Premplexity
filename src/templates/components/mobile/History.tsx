import { getActionPath, getPartialPath } from "$routers/website/utils"
import Dropdown, { DropdownItem } from "$templates/components/Dropdown"
import DropdownTrigger from "$templates/components/DropdownTrigger"
import Icon from "$templates/components/Icon"
import { ThreadListItem } from "$templates/views/NewThreadView"
import THREAD_MESSAGE_STATUS from "$types/THREAD_MESSAGE_STATUS"

type Props = {
  threadsList: ThreadListItem[]
  swapOOB?: string
}

const History = ({
  threadsList,
  swapOOB
}: Props) => {
  return (
    <div
      id="history-list"
      class={"sidebar__body px-4 h-[calc(100vh-266px)] !mt-[146px]"}
      {...(swapOOB ? { "hx-swap-oob": swapOOB } : {})}
    >
      {threadsList.length ? (
        threadsList.map(({ time, threads }) => (
          <>
            {
              threads.length > 0 ?
              <div class={"text-sm text-gray-500"} safe>
                {time}
              </div> : null
            }
            {
              threads.map((chat) => {
                const dropdownId = `thread-${chat.id}-dropdown-mobile`
                const dropdownPosition = "left"
                const hasMessages = !!chat.messages.filter(m => m.currentMessage.status === THREAD_MESSAGE_STATUS.COMPLETED).length
                const items: DropdownItem[] = [
                  ...hasMessages ? [{
                    title: "Share thread",
                    icon: "upload",
                    type: "primary",
                    href: getActionPath("thread", "SHARE", { targetThreadId: chat.id }),
                    "hx-target": "#modal",
                    "hx-swap": "innerHTML",
                    "hx-boost": "true",
                    "hx-push-url": "false",
                  } as DropdownItem] : [],
                  {
                    title: "Delete",
                    icon: "trash",
                    type: "danger",
                    href: getPartialPath("thread", "DELETE_MODAL", { targetThreadId: chat.id }),
                    "hx-target": "#modal",
                    "hx-swap": "innerHTML",
                    "hx-boost": "true",
                    "hx-push-url": "false",
                  }
                ]

                return (
                  <div class={"sidebar__body__item cursor-pointer"} hx-get={`/thread/${chat.id}`} hx-push-url="true">
                    <div class={"truncate"} safe>{chat.title}</div>
                    <DropdownTrigger
                      aria-haspopup="true"
                      aria-controls={dropdownId}
                      dropdownId={dropdownId}
                      data-hide-on-clickaway="true"
                      data-position={dropdownPosition}
                    >
                      <Icon name="dots-vertical" size={18} />
                    </DropdownTrigger>
                    <Dropdown
                      clone
                      id={dropdownId}
                      items={items}
                      position={dropdownPosition}
                    />
                  </div>
                )
              })
            }
          </>
        ))
      ) : null
      }
    </div>
  )
}

export default History
