<template>
  <div class="bg-gray-500">
    <div class="w-3 h-full bg-green-500 cursor-pointer" @click="subscribeUserToPush">
      <p class="pl-5">NORMAL</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
async function subscribeUserToPush(): Promise<void> {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  }
  // try {
  //   const publicVapidKey =
  //     "BFQnFTzAmFmr8iB99x5E1gf-qTIfn6Ff_KOxVcFBrsX1TpYVlW1Lst2hqTf4F80YOQKLvnxkOS0LJftbnqspwm0";
  //
  //   const sw = await navigator.serviceWorker.ready;
  //   const subscribeOptions = {
  //     userVisibleOnly: true,
  //     applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  //   };
  //
  //   // Subscribe to push
  //   const push = await sw.pushManager.subscribe(subscribeOptions);
  //
  //   console.log("Subscription:", push);
  //
  //   const response = await fetch(`${config.apiUrl}/subscribe`, {
  //     method: "POST",
  //     body: JSON.stringify(push),
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${userState.user?.access}`,
  //     },
  //   });
  //
  //   if (!response.ok) {
  //     throw new Error("Bad status code from server.");
  //   }
  //
  //   const responseData = await response.json();
  //
  //   if (!(responseData.data && responseData.data.success)) {
  //     throw new Error("Bad response from server.");
  //   }
  //
  //   console.log("Subscribed to push.");
  //   toast.success("Subscribed to push!", {
  //     autoClose: 3000,
  //     position: toast.POSITION.BOTTOM_RIGHT,
  //   });
  // } catch (error) {
  //   console.error("Error subscribing to push:", error);
  //   toast.error("Error subscribing to push!", {
  //     autoClose: 3000,
  //     position: toast.POSITION.BOTTOM_RIGHT,
  //   });
  // }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
</script>

<style scoped></style>
