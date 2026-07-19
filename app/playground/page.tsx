"use client";

import { useState } from "react";
import { Disclosure } from "@/components/playground/Disclosure";
import { Tabs } from "@/components/playground/Tabs";
import { Modal } from "@/components/playground/Modal";

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-2xl font-bold">Accessibility Playground</h1>
      <p className="mt-2 text-gray-600">Hand-built components tested against W3C ARIA patterns.</p>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Disclosure</h2>
        <Disclosure summary="Show more ▾">
          <p className="mt-2">Try tabbing to the button and pressing Enter or Space.</p>
        </Disclosure>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Tabs</h2>
        <Tabs
          tabs={[
            { id: "one", label: "Profile", content: <p className="mt-2">Profile panel content goes here.</p> },
            { id: "two", label: "Security", content: <p className="mt-2">Security panel content goes here.</p> },
            { id: "three", label: "Notifications", content: <p className="mt-2">Notifications panel content goes here.</p> },
          ]}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Modal</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-2 rounded-md bg-gray-900 px-4 py-2 text-white"
        >
          Open Modal
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          titleId="demo-modal-title"
          title="Example Modal"
        >
          <p>Press Tab — focus should stay trapped inside here. Press Escape to close.</p>
          <input type="text" placeholder="Sample input" className="mt-2 border p-1" />
        </Modal>
      </div>
    </section>
  );
}