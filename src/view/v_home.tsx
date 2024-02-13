import { SortDesc, Timer } from "lucide-react";
import { AppList } from "./app/v_app_list";
import { signal, useSignal } from "@preact/signals";

function _HomeMessage() {
  return (
    <div class="card secondary">
      <b>Hi there.</b> Since the end of last year, Google requires new
      developers to test their apps with at least 20 users before publishing
      them on the Play Store. This is a good thing, but it also means that you
      need to find a way to find them. To make this a little easier, I spent a
      couple weekends building this website. It's a simple way to find apps that
      need testing and earn credits (called sparkles). If you're a developer,
      you can add your app to the list for 20 sparkles.
      <br />
      <br />I hope you find it useful. If you have any feedback, please let me
      know. Yours, Robin
      <br />
      <br />
      <span class="text-s">
        This is FOSS build with <a href="https://preactjs.com/">Preact</a> and{" "}
        <a href="https://pocketbase.io/">PocketBase</a>{" "}
      </span>
    </div>
  );
}

export function HomeView({}) {
  const sortSignal = useSignal(true);

  return (
    <div class="base_limited column cross-stretch gap-double">
      <_HomeMessage />
      <h3>apps in testing</h3>
      <div class="row-resp resp-reverse gap-double">
        <div class="column cross-stretch main-start flex-3">
          <AppList sort={sortSignal.value ? "-created" : "+name"} />
        </div>
        <div class="column flex-1 cross-stretch">
          <div
            class="card column cross-stretch gap-none"
            style="padding: 0; overflow: clip"
          >
            <button
              class={
                "margin-none sharp text-left " +
                (sortSignal.value ? "loud minor" : "integrated")
              }
              onClick={() => {
                sortSignal.value = true;
              }}
            >
              <Timer /> <div>recent</div>
            </button>
            <button
              class={
                "margin-none sharp text-left " +
                (!sortSignal.value ? "loud minor" : "integrated")
              }
              onClick={() => (sortSignal.value = false)}
            >
              <SortDesc /> <div>sorted</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
