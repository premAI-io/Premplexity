import { getActionPath, getPartialPath } from "$routers/website/utils"
import Dropdown, { DropdownItem } from "$templates/components/Dropdown"
import DropdownTrigger from "$templates/components/DropdownTrigger"
import Icon from "$templates/components/Icon"
import Logo from "$templates/components/Logo"
import { ThreadListItem } from "$templates/views/NewThreadView"
import MobileNavbar from "$templates/components/mobile/Navbar"
import THREAD_MESSAGE_STATUS from "$types/THREAD_MESSAGE_STATUS"

type Props = {
  threadsList: ThreadListItem[]
  activeThreadId?: number
  swapOOB?: string
  active: "chat" | "history"
  lastViewedThreadId?: number
  withMobileNavbar?: boolean
}

const Sidebar = ({
  threadsList,
  activeThreadId,
  swapOOB,
  active,
  lastViewedThreadId,
  withMobileNavbar = true
}: Props) => {
  return (
    <>
    <div
      id="sidebar"
      class="sidebar"
      text-ellipsis-exclude
      {...swapOOB ? { "hx-swap-oob": swapOOB } : {}}
    >
      <div class={"sidebar__head"}>
        <a class={"flex items-center gap-2 text-white"} href="/" hx-boost="true">
          <Logo />
          <div>
            <span class="font-bold">Prem</span>plexity
          </div>
        </a>
        <div class={"flex items-center gap-2"}>
          <Icon name="history" viewBox={"0 0 16 14"} />
          <div>History</div>
        </div>
      </div>
      <div class={"sidebar__body"} onscroll="onSidebarScroll(event)">
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
                  const dropdownId = `thread-${chat.id}-dropdown`
                  const dropdownPosition = "right"
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
                  if (chat.id === activeThreadId) {
                    return (
                      <div class={"sidebar__body__item cursor-default active"}>
                        <div class={"truncate"} safe>{chat.title}</div>
                        <DropdownTrigger
                          aria-haspopup="true"
                          aria-controls={dropdownId}
                          dropdownId={dropdownId}
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
                  }

                  return (
                    <div class={"sidebar__body__item cursor-pointer"} hx-get={`/thread/${chat.id}`} hx-push-url="true">
                      <div class={"truncate"} safe>{chat.title}</div>
                      <DropdownTrigger
                        class="hidden thread-dropdown-trigger"
                        aria-haspopup="true"
                        aria-controls={dropdownId}
                        dropdownId={dropdownId}
                        data-hide-on-clickaway="true"
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
    </div>
    {
      withMobileNavbar ?
      <MobileNavbar active={active} lastViewedThreadId={lastViewedThreadId} /> : null
    }
    </>
  )
}

export default Sidebar
