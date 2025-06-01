<template>
  <div class="person-form-view p-4">
    <h1>{{ isEditMode ? 'Edit Person' : 'Add New Person' }}</h1>
    <div class="card p-fluid">
      <div class="field grid">
        <label for="firstname" class="col-12 mb-2 md:col-2 md:mb-0">First Name *</label>
        <div class="col-12 md:col-10">
          <InputText id="firstname" v-model.trim="person.first_name" required autofocus :invalid="submitted && !person.first_name" />
          <small class="p-error" v-if="submitted && !person.first_name">First name is required.</small>
        </div>
      </div>

      <div class="field grid">
        <label for="middlename" class="col-12 mb-2 md:col-2 md:mb-0">Middle Name</label>
        <div class="col-12 md:col-10">
          <InputText id="middlename" v-model.trim="person.middle_name" />
        </div>
      </div>

      <div class="field grid">
        <label for="lastname" class="col-12 mb-2 md:col-2 md:mb-0">Last Name</label>
        <div class="col-12 md:col-10">
          <InputText id="lastname" v-model.trim="person.last_name" />
        </div>
      </div>

      <div class="field grid">
        <label for="birthdate" class="col-12 mb-2 md:col-2 md:mb-0">Birth Date</label>
        <div class="col-12 md:col-10">
          <Calendar id="birthdate" v-model="person.birth_date" dateFormat="yy-mm-dd" showIcon />
        </div>
      </div>

      <div class="field grid">
        <label for="deathdate" class="col-12 mb-2 md:col-2 md:mb-0">Death Date</label>
        <div class="col-12 md:col-10">
          <Calendar id="deathdate" v-model="person.death_date" dateFormat="yy-mm-dd" showIcon />
        </div>
      </div>

      <div class="field grid">
        <label for="gender" class="col-12 mb-2 md:col-2 md:mb-0">Gender</label>
        <div class="col-12 md:col-10">
          <Dropdown id="gender" v-model="person.gender" :options="genderOptions" optionLabel="name" optionValue="value" placeholder="Select a Gender" />
        </div>
      </div>

      <div class="field grid">
        <label for="bio" class="col-12 mb-2 md:col-2 md:mb-0">Bio</label>
        <div class="col-12 md:col-10">
          <Textarea id="bio" v-model="person.bio" rows="5" />
        </div>
      </div>

      <div class="field grid">
        <label for="profilepictureurl" class="col-12 mb-2 md:col-2 md:mb-0">Profile Picture URL</label>
        <div class="col-12 md:col-10">
          <InputText id="profilepictureurl" v-model.trim="person.profile_picture_url" />
        </div>
      </div>

      <div class="form-actions flex justify-content-end gap-2 mt-4">
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="goBack" />
        <Button :label="isEditMode ? 'Update' : 'Save'" icon="pi pi-check" @click="handleSubmit" :loading="loading" />
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

interface Person {
  id?: number;
  first_name: string;
  last_name?: string;
  middle_name?: string;
  birth_date?: string; // Store as YYYY-MM-DD string
  death_date?: string; // Store as YYYY-MM-DD string
  gender?: string;
  bio?: string;
  profile_picture_url?: string;
}

const person = ref<Person>({
  first_name: '',
  last_name: 'Herrmann', // Default surname
});
const loading = ref(false);
const submitted = ref(false);
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const API_URL = 'http://localhost:3000/api';
const personId = computed(() => route.params.id as string | undefined);
const isEditMode = computed(() => !!personId.value);

const genderOptions = ref([
  { name: 'Male', value: 'Male' },
  { name: 'Female', value: 'Female' },
  { name: 'Other', value: 'Other' },
  { name: 'Prefer not to say', value: 'Prefer not to say' }
]);

// Helper to format date to YYYY-MM-DD string for API
const formatDateForApi = (date: Date | string | undefined): string | undefined => {
  if (!date) return undefined;
  if (typeof date === 'string') { // If already a string, assume it's in correct format or needs parsing
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return date; // Return original if invalid
    return parsedDate.toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
};


const fetchPersonDetails = async () => {
  if (!isEditMode.value || !personId.value) return;
  loading.value = true;
  try {
    const response = await fetch(`${API_URL}/persons/${personId.value}`, {
      headers: { /* 'Authorization': `Bearer ${authStore.token}` */ }
    });
    if (!response.ok) throw new Error('Failed to fetch person details');
    const data = await response.json();
    // Dates from backend are TEXT (YYYY-MM-DD), which is fine for v-model with Calendar
    person.value = { ...data };
  } catch (error) {
    console.error('Error fetching person details:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load person data.', life: 3000 });
    router.push({ name: 'PersonsList' });
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  submitted.value = true;
  if (!person.value.first_name) {
    toast.add({ severity: 'warn', summary: 'Validation Error', detail: 'First name is required.', life: 3000 });
    return;
  }
  loading.value = true;

  const payload = {
    ...person.value,
    birth_date: formatDateForApi(person.value.birth_date),
    death_date: formatDateForApi(person.value.death_date),
  };

  const url = isEditMode.value ? `${API_URL}/persons/${personId.value}` : `${API_URL}/persons`;
  const method = isEditMode.value ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || `Failed to ${isEditMode.value ? 'update' : 'save'} person`);
    }

    toast.add({ severity: 'success', summary: 'Success', detail: `Person ${isEditMode.value ? 'updated' : 'saved'} successfully.`, life: 3000 });
    router.push({ name: 'PersonsList' });
  } catch (error: any) {
    console.error(`Error ${isEditMode.value ? 'updating' : 'saving'} person:`, error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Operation failed.', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'PersonsList' });
};

onMounted(() => {
  if (isEditMode.value) {
    fetchPersonDetails();
  }
});
</script>

<style scoped>
.person-form-view {
  max-width: 800px;
  margin: 0 auto;
}
.card {
  padding: 2rem;
}
</style>
