<template>
  <div class="persons-list-view p-4">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1>Persons</h1>
      <Button label="Add Person" icon="pi pi-plus" @click="goToAddPerson" />
    </div>

    <DataTable :value="persons" :loading="loading" responsiveLayout="scroll">
      <Column field="id" header="ID" :sortable="true"></Column>
      <Column field="first_name" header="First Name" :sortable="true"></Column>
      <Column field="last_name" header="Last Name" :sortable="true"></Column>
      <Column field="birth_date" header="Birth Date" :sortable="true">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.birth_date) }}
        </template>
      </Column>
      <Column field="gender" header="Gender"></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="goToEditPerson(slotProps.data.id)" />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeletePerson(slotProps.data)" />
        </template>
      </Column>
      <template #empty>
          No persons found.
      </template>
      <template #loading>
          Loading persons data. Please wait.
      </template>
    </DataTable>

    <ConfirmDialog></ConfirmDialog>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

// Define Person interface
interface Person {
  id: number;
  first_name: string;
  last_name?: string;
  middle_name?: string;
  birth_date?: string;
  death_date?: string;
  gender?: string;
  bio?: string;
  profile_picture_url?: string;
}

const persons = ref<Person[]>([]);
const loading = ref(true);
const router = useRouter();
const authStore = useAuthStore();
const confirm = useConfirm();
const toast = useToast();

const API_URL = 'http://localhost:3000/api';

const fetchPersons = async () => {
  loading.value = true;
  try {
    const response = await fetch(`${API_URL}/persons`, {
      headers: {
        // 'Authorization': `Bearer ${authStore.token}` // If token auth is implemented
      }
    });
    if (!response.ok) throw new Error('Failed to fetch persons');
    persons.value = await response.json();
  } catch (error) {
    console.error('Error fetching persons:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load persons.', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const goToAddPerson = () => {
  router.push({ name: 'PersonCreate' });
};

const goToEditPerson = (id: number) => {
  router.push({ name: 'PersonEdit', params: { id } });
};

const confirmDeletePerson = (person: Person) => {
  confirm.require({
    message: `Are you sure you want to delete ${person.first_name} ${person.last_name || ''}?`,
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClassName: 'p-button-danger',
    accept: async () => {
      await deletePerson(person.id);
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelled', detail: 'Deletion cancelled.', life: 3000 });
    }
  });
};

const deletePerson = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/persons/${id}`, {
      method: 'DELETE',
      headers: {
        // 'Authorization': `Bearer ${authStore.token}`
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete person');
    }
    toast.add({ severity: 'success', summary: 'Success', detail: 'Person deleted successfully.', life: 3000 });
    fetchPersons(); // Refresh the list
  } catch (error: any) {
    console.error('Error deleting person:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to delete person.', life: 3000 });
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  // Assuming date is YYYY-MM-DD or similar from SQLite
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // if invalid date, return original
  return date.toLocaleDateString();
};

onMounted(fetchPersons);
</script>

<style scoped>
.persons-list-view {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
