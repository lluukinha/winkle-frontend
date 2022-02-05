<script setup lang="ts">
import { ref } from "vue";
import SidebarIcon from "./SidebarIcon.vue";
import { ISidebarItem } from "./ISidebarItem";

defineProps<{ items: ISidebarItem[] }>()
const isOpen = ref(true);
</script>

<template>
  <!-- Sidebar starts -->
  <!-- Remove class [ hidden ] and replace [ sm:flex ] with [ flex ] -->
  <div
    class="
      w-64
      absolute
      sm:relative
      bg-gray-800
      shadow
      md:h-screen
      flex-col
      justify-between
      hidden
      sm:flex
    "
  >
    <div class="px-8">
      <div class="flex items-center flex-shrink-0 text-white mr-6 pt-8">
        <svg
          class="fill-current h-8 w-8 mr-2"
          width="54"
          height="54"
          viewBox="0 0 54 54"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"
          />
        </svg>
        <span class="font-semibold text-xl tracking-tight">Winkle</span>
      </div>
      <ul class="mt-10">
        <li
          class="flex
            w-full
            justify-between
            text-gray-300
            cursor-pointer
            items-center
            mb-6"
          v-for="item in items"
          :key="item.name"
        >
          <a class="flex
              items-center
              focus:outline-none focus:ring-2 focus:ring-white">
            <SidebarIcon :icon="item.icon" />
            <span class="text-sm ml-2">{{ item.name }}</span>
          </a>
          <div class="py-1 px-3 bg-gray-600 rounded text-gray-300 flex items-center justify-center text-xs">
            5
          </div>
        </li>
        <li
          class="
            flex
            w-full
            justify-between
            text-gray-400
            hover:text-gray-300
            cursor-pointer
            items-center
            mb-6
          "
        >
          <a
            href="javascript:void(0)"
            class="
              flex
              items-center
              focus:outline-none focus:ring-2 focus:ring-white
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-puzzle"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <path
                d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1"
              ></path>
            </svg>
            <span class="text-sm ml-2">Products</span>
          </a>
          <div
            class="
              py-1
              px-3
              bg-gray-600
              rounded
              text-gray-300
              flex
              items-center
              justify-center
              text-xs
            "
          >
            8
          </div>
        </li>
        <li
          class="
            flex
            w-full
            justify-between
            text-gray-400
            hover:text-gray-300
            cursor-pointer
            items-center
            mb-6
          "
        >
          <a
            href="javascript:void(0)"
            class="
              flex
              items-center
              focus:outline-none focus:ring-2 focus:ring-white
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-compass"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <polyline points="8 16 10 10 16 8 14 14 8 16"></polyline>
              <circle cx="12" cy="12" r="9"></circle>
            </svg>
            <span class="text-sm ml-2">Performance</span>
          </a>
        </li>
        <li
          class="
            flex
            w-full
            justify-between
            text-gray-400
            hover:text-gray-300
            cursor-pointer
            items-center
            mb-6
          "
        >
          <a
            href="javascript:void(0)"
            class="
              flex
              items-center
              focus:outline-none focus:ring-2 focus:ring-white
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-code"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <polyline points="7 8 3 12 7 16"></polyline>
              <polyline points="17 8 21 12 17 16"></polyline>
              <line x1="14" y1="4" x2="10" y2="20"></line>
            </svg>
            <span class="text-sm ml-2">Deliverables</span>
          </a>
        </li>
        <li
          class="
            flex
            w-full
            justify-between
            text-gray-400
            hover:text-gray-300
            cursor-pointer
            items-center
            mb-6
          "
        >
          <a
            href="javascript:void(0)"
            class="
              flex
              items-center
              focus:outline-none focus:ring-2 focus:ring-white
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-puzzle"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <path
                d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1"
              ></path>
            </svg>
            <span class="text-sm ml-2">Invoices</span>
          </a>
          <div
            class="
              py-1
              px-3
              bg-gray-600
              rounded
              text-gray-300
              flex
              items-center
              justify-center
              text-xs
            "
          >
            25
          </div>
        </li>
        <li
          class="
            flex
            w-full
            justify-between
            text-gray-400
            hover:text-gray-300
            cursor-pointer
            items-center
            mb-6
          "
        >
          <a
            href="javascript:void(0)"
            class="
              flex
              items-center
              focus:outline-none focus:ring-2 focus:ring-white
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-stack"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <polyline points="12 4 4 8 12 12 20 8 12 4" />
              <polyline points="4 12 12 16 20 12" />
              <polyline points="4 16 12 20 20 16" />
            </svg>
            <span class="text-sm ml-2">Inventory</span>
          </a>
        </li>
        <li
          class="
            flex
            w-full
            justify-between
            text-gray-400
            hover:text-gray-300
            cursor-pointer
            items-center
          "
        >
          <a
            href="javascript:void(0)"
            class="
              flex
              items-center
              focus:outline-none focus:ring-2 focus:ring-white
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-settings"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span class="text-sm ml-2">Settings</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="px-8 border-t border-gray-700">
      <ul class="w-full flex items-center justify-between bg-gray-800">
        <li class="cursor-pointer text-white pt-5 pb-3">
          <button
            aria-label="show notifications"
            class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300"
          >
            <img
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg3.svg"
              alt="notifications"
            />
          </button>
        </li>
        <li class="cursor-pointer text-white pt-5 pb-3">
          <button
            aria-label="open chats"
            class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300"
          >
            <img
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg4.svg"
              alt="chat"
            />
          </button>
        </li>
        <li class="cursor-pointer text-white pt-5 pb-3">
          <button
            aria-label="open settings"
            class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300"
          >
            <img
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg5.svg"
              alt="settings"
            />
          </button>
        </li>
        <li class="cursor-pointer text-white pt-5 pb-3">
          <button
            aria-label="open logs"
            class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300"
          >
            <img
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg6.svg"
              alt="drawer"
            />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>