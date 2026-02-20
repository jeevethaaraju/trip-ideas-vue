<template>
  <section class="controls">
    <select v-model="state">
      <option value="">Select State</option>
      <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
    </select>
    <select v-model="activity">
      <option value="">Select Activity</option>
      <option v-for="a in activities" :key="a" :value="a">{{ a }}</option>
    </select>
    <button @click="fetchTrips" :disabled="loading">
      {{ loading ? 'Searching...' : 'Find Trips' }}
    </button>
  </section>

  <div class="result-header">
    <div v-if="loading" class="loading">Loading places, please wait...</div>
    <div v-if="!loading && trips.length" class="count-bar">Found {{ trips.length }} places</div>
    <p v-if="!loading && trips.length === 0 && searched">No places found.</p>
  </div>

  <div id="results">
    <div v-for="(place, index) in trips" :key="index" class="card">
      <img
        :src="place.imageUrl || `https://source.unsplash.com/400x250/?${encodeURIComponent(place.name + ' ' + state)}`"
        class="card-img"
        @click="openModal(place.imageUrl)"
      />
      <div class="card-content">
        <h3>{{ index + 1 }}. {{ place.name }}</h3>
        <p>{{ place.address || state }}</p>
        <div class="links">
          <a :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + state)}`" target="_blank">📍 Google Maps</a>
          <a :href="`https://www.google.com/search?q=${encodeURIComponent(place.name + ' ' + state)}`" target="_blank">🌐 Websites</a>
          <a :href="`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(place.name + ' ' + state)}`" target="_blank">🖼 Images</a>
          <a :href="`https://www.youtube.com/results?search_query=${encodeURIComponent(place.name + ' ' + state)}`" target="_blank">▶ YouTube</a>
          <a :href="`https://www.tiktok.com/search?q=${encodeURIComponent(place.name + ' ' + state)}`" target="_blank">🎵 TikTok</a>
        </div>
      </div>
    </div>
  </div>

  <div v-if="modalVisible" id="imgModal" @click="modalVisible = false">
    <div class="modal-content">
      <img :src="modalImg" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "TripSearch",
  setup() {
    const state = ref("");
    const activity = ref("");
    const trips = ref([]);
    const searched = ref(false);
    const loading = ref(false);
    const modalVisible = ref(false);
    const modalImg = ref("");
    const states = [
      "Johor","Kedah","Kelantan","Melaka","Negeri Sembilan",
      "Pahang","Penang","Perak","Perlis","Sabah","Sarawak",
      "Selangor","Terengganu","Kuala Lumpur","Labuan","Putrajaya"
    ];
    const activities = ["fun","thrill","horror","nature","historical"];
    const fetchTrips = async () => {
      if (!state.value) {
        alert("Please select a state!");
        return;
      }
      searched.value = false;
      loading.value = true;
      trips.value = [];
      try {
        const resp = await fetch(`http://localhost:3000/getTrips?state=${state.value}&activity=${activity.value}`);
        if (!resp.ok) {
          console.error("HTTP error:", resp.status);
          trips.value = [];
          return;
        }
        const data = await resp.json();
        trips.value = data;
      } catch (err) {
        console.error("Fetch error:", err);
        trips.value = [];
      } finally {
        loading.value = false;
        searched.value = true;
      }
    };
    const openModal = (imgUrl) => {
      modalImg.value = imgUrl;
      modalVisible.value = true;
    };
    return { state, activity, trips, states, activities, fetchTrips, modalVisible, modalImg, openModal, searched, loading };
  },
};
</script>