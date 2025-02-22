import React from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";

export default function SideBar() {
  return (
    <Sidebar aria-label="Sidebar Example" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg rounded-lg">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie} className="transition-all duration-300 hover:bg-blue-600 hover:text-white rounded-lg p-3">
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiViewBoards} label="Pro" labelColor="dark" className="transition-all duration-300 hover:bg-blue-600 hover:text-white rounded-lg p-3">
            Kanban
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiInbox} label="3" className="transition-all duration-300 hover:bg-blue-600 hover:text-white rounded-lg p-3">
            Inbox
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiUser} className="transition-all duration-300 hover:bg-blue-600 hover:text-white rounded-lg p-3">
            Users
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiShoppingBag} className="transition-all duration-300 hover:bg-blue-600 hover:text-white rounded-lg p-3">
            Products
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiArrowSmRight} className="transition-all duration-300 hover:bg-blue-600 hover:text-white rounded-lg p-3">
            Sign In
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiTable} className="transition-all duration-300 hover:bg-blue-600 hover:text-white rounded-lg p-3">
            Sign Up
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
