<template>
  <div class="persons-list-view p-4">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="m-0">Persons</h1> <!-- m-0 to align with button -->
      <Button label="Add Person" icon="pi pi-plus" @click="goToAddPerson" class="p-button-success" /> <!-- Added success class -->
    </div>

    <DataTable :value="persons" :loading="loading" responsiveLayout="scroll" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
      <Column field="id" header="ID" :sortable="true" style="width:6rem"></Column>
      <Column field="first_name" header="First Name" :sortable="true"></Column>
      <Column field="last_name" header="Last Name" :sortable="true"></Column>
      <Column field="birth_date" header="Birth Date" :sortable="true">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.birth_date) }}
        </template>
      </Column>
      <Column field="gender" header="Gender"></Column>
      <Column header="Actions" style="width:10rem; text-align:center"> <!-- Adjusted width and alignment -->
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2 p-button-sm" @click="goToEditPerson(slotProps.data.id)" />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-sm" @click="confirmDeletePerson(slotProps.data)" />
        </template>
      </Column>
      <template #empty>
          No persons found. Click 'Add Person' to create one.
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
// import { useAuthStore } from '@/stores/auth'; // Not used directly here currently
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

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
// const authStore = useAuthStore(); // Not used
const confirm = useConfirm();
const toast = useToast();

const API_URL = 'http://localhost:3000/api';

const fetchPersons = async () => {
  loading.value = true;
  try {
    const response = await fetch(`${API_URL}/persons`);
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
      // Optional: toast.add({ severity: 'info', summary: 'Cancelled', detail: 'Deletion cancelled.', life: 3000 });
    }
  });
};

const deletePerson = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/persons/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete person');
    }
    toast.add({ severity: 'success', summary: 'Success', detail: 'Person deleted successfully.', life: 3000 });
    fetchPersons();
  } catch (error: any) {
    console.error('Error deleting person:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to delete person.', life: 3000 });
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString();
};

onMounted(fetchPersons);
</script>

<style scoped>
.persons-list-view {
  max-width: 1200px;
  margin: 0 auto;
}
/* Ensure buttons in DataTable cells are vertically aligned if needed */
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  vertical-align: middle;
}
</style>
