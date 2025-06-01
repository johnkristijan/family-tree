<template>
  <div class="person-form-view p-4">
    <h1 class="mb-4">{{ isEditMode ? 'Edit Person' : 'Add New Person' }}</h1>

    <TabView>
      <TabPanel header="Personal Details">
        <div class="card p-fluid mt-3">
          <div class="field grid">
            <label for="firstname" class="col-12 mb-2 md:col-2 md:mb-0 align-self-center">First Name *</label>
            <div class="col-12 md:col-10">
              <InputText id="firstname" v-model.trim="person.first_name" required autofocus :invalid="submitted && !person.first_name" />
              <small class="p-error" v-if="submitted && !person.first_name">First name is required.</small>
            </div>
          </div>

          <div class="field grid">
            <label for="middlename" class="col-12 mb-2 md:col-2 md:mb-0 align-self-center">Middle Name</label>
            <div class="col-12 md:col-10">
              <InputText id="middlename" v-model.trim="person.middle_name" />
            </div>
          </div>

          <div class="field grid">
            <label for="lastname" class="col-12 mb-2 md:col-2 md:mb-0 align-self-center">Last Name</label>
            <div class="col-12 md:col-10">
              <InputText id="lastname" v-model.trim="person.last_name" />
            </div>
          </div>

          <div class="field grid">
            <label for="birthdate" class="col-12 mb-2 md:col-2 md:mb-0 align-self-center">Birth Date</label>
            <div class="col-12 md:col-10">
              <Calendar id="birthdate" v-model="person.birth_date" dateFormat="yy-mm-dd" showIcon panelStyleClass="custom-calendar-panel" />
            </div>
          </div>

          <div class="field grid">
            <label for="deathdate" class="col-12 mb-2 md:col-2 md:mb-0 align-self-center">Death Date</label>
            <div class="col-12 md:col-10">
              <Calendar id="deathdate" v-model="person.death_date" dateFormat="yy-mm-dd" showIcon panelStyleClass="custom-calendar-panel" />
            </div>
          </div>

          <div class="field grid">
            <label for="gender" class="col-12 mb-2 md:col-2 md:mb-0 align-self-center">Gender</label>
            <div class="col-12 md:col-10">
              <Dropdown id="gender" v-model="person.gender" :options="genderOptions" optionLabel="name" optionValue="value" placeholder="Select a Gender" />
            </div>
          </div>

          <div class="field grid">
            <label for="bio" class="col-12 mb-2 md:col-2 md:mb-0 align-self-start">Bio</label> <!-- Changed to align-self-start -->
            <div class="col-12 md:col-10">
              <Textarea id="bio" v-model="person.bio" rows="5" />
            </div>
          </div>

          <div class="field grid">
            <label for="profilepictureurl" class="col-12 mb-2 md:col-2 md:mb-0 align-self-center">Profile Picture URL</label>
            <div class="col-12 md:col-10">
              <InputText id="profilepictureurl" v-model.trim="person.profile_picture_url" />
            </div>
          </div>

          <div class="form-actions flex justify-content-end gap-2 mt-5"> <!-- Increased mt margin -->
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="goBack" />
            <Button :label="isEditMode ? 'Update Details' : 'Save Details'" icon="pi pi-check" @click="handleDetailsSubmit" :loading="detailsLoading" />
          </div>
        </div>
      </TabPanel>

      <TabPanel header="Relationships" :disabled="!isEditMode">
        <div v-if="isEditMode" class="card mt-3">
          <Toolbar class="mb-4 p-toolbar-sm"> <!-- Added p-toolbar-sm for smaller padding -->
            <template #start>
              <h5 class="m-0">Manage Relationships</h5> <!-- Removed margin from h5 -->
            </template>
            <template #end>
              <Button label="Add Relationship" icon="pi pi-plus" class="p-button-success p-button-sm" @click="openNewRelationshipDialog" /> <!-- p-button-sm -->
            </template>
          </Toolbar>

          <DataTable :value="relationships" :loading="relationshipsLoading" responsiveLayout="scroll" scrollable scrollHeight="400px">
            <Column header="Relationship To">
              <template #body="slotProps">
                {{ formatRelatedPersonName(slotProps.data) }}
              </template>
            </Column>
            <Column field="relationship_type" header="Type">
              <template #body="slotProps">
                {{ formatRelationshipType(slotProps.data) }}
              </template>
            </Column>
            <Column field="start_date" header="Start Date">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.start_date) }}
              </template>
            </Column>
            <Column field="end_date" header="End Date">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.end_date) }}
              </template>
            </Column>
            <Column header="Actions" style="width: 8rem"> <!-- Fixed width for actions -->
              <template #body="slotProps">
                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-sm" @click="confirmDeleteRelationship(slotProps.data)" /> <!-- p-button-sm -->
              </template>
            </Column>
            <template #empty>
                No relationships found for this person.
            </template>
            <template #loading>
                Loading relationships data. Please wait.
            </template>
          </DataTable>
        </div>
        <div v-else class="mt-3 p-3 border-1 surface-border border-round surface-ground text-center"> <!-- Added text-center and surface-ground -->
          Save person details first to manage relationships.
        </div>
      </TabPanel>
    </TabView>

    <!-- Add/Edit Relationship Dialog -->
    <Dialog v-model:visible="relationshipDialogVisible" :style="{width: '480px'}" header="Add New Relationship" :modal="true" class="p-fluid">
      <div class="field mt-3"> <!-- Added mt-3 -->
        <label for="relationshipType">Relationship Type *</label>
        <Dropdown id="relationshipType" v-model="newRelationship.relationshipType" :options="relationshipTypeOptions"
                  placeholder="Select a Type" :invalid="relationshipSubmitted && !newRelationship.relationshipType" />
        <small class="p-error" v-if="relationshipSubmitted && !newRelationship.relationshipType">Type is required.</small>
      </div>

      <div class="field mt-3">
        <label for="relatedPersonId">Related Person *</label>
        <Dropdown id="relatedPersonId" v-model="newRelationship.relatedPersonId" :options="availablePersonsForRelationship"
                  optionLabel="fullName" optionValue="id" placeholder="Select a Person" filter
                  :invalid="relationshipSubmitted && !newRelationship.relatedPersonId" />
        <small class="p-error" v-if="relationshipSubmitted && !newRelationship.relatedPersonId">Person is required.</small>
      </div>

      <div class="field mt-3">
        <label for="relStartDate">Start Date</label>
        <Calendar id="relStartDate" v-model="newRelationship.startDate" dateFormat="yy-mm-dd" showIcon panelStyleClass="custom-calendar-panel" />
      </div>
      <div class="field mt-3">
        <label for="relEndDate">End Date</label>
        <Calendar id="relEndDate" v-model="newRelationship.endDate" dateFormat="yy-mm-dd" showIcon panelStyleClass="custom-calendar-panel" />
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideRelationshipDialog" />
        <Button label="Save Relationship" icon="pi pi-check" @click="saveRelationship" :loading="relationshipSaving" />
      </template>
    </Dialog>

    <ConfirmDialog></ConfirmDialog>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Toolbar from 'primevue/toolbar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ConfirmDialog from 'primevue/confirmdialog';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';


interface Person {
  id?: number;
  first_name: string;
  last_name?: string;
  middle_name?: string;
  birth_date?: string;
  death_date?: string;
  gender?: string;
  bio?: string;
  profile_picture_url?: string;
  fullName?: string;
}

interface Relationship {
  id: number;
  person1_id: number;
  person1_first_name?: string;
  person1_last_name?: string;
  person2_id: number;
  person2_first_name?: string;
  person2_last_name?: string;
  relationship_type: string;
  start_date?: string;
  end_date?: string;
}

interface NewRelationship {
  relatedPersonId: number | null;
  relationshipType: string | null;
  startDate?: string;
  endDate?: string;
}

const person = ref<Person>({
  first_name: '',
  last_name: 'Herrmann',
});
const detailsLoading = ref(false);
const submitted = ref(false);

const relationships = ref<Relationship[]>([]);
const relationshipsLoading = ref(false);
const relationshipDialogVisible = ref(false);
const relationshipSubmitted = ref(false);
const relationshipSaving = ref(false);
const newRelationship = ref<NewRelationship>({
  relatedPersonId: null,
  relationshipType: null,
});

const allPersons = ref<Person[]>([]);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();
const confirm = useConfirm();

const API_URL = 'http://localhost:3000/api';
const personId = computed(() => route.params.id ? parseInt(route.params.id as string, 10) : undefined);
const isEditMode = computed(() => !!personId.value);

const genderOptions = ref([
  { name: 'Male', value: 'Male' },
  { name: 'Female', value: 'Female' },
  { name: 'Other', value: 'Other' },
  { name: 'Prefer not to say', value: 'Prefer not to say' }
]);

const relationshipTypeOptions = ref([
  { label: 'Parent Of', value: 'parent_of' },
  { label: 'Child Of', value: 'child_of' },
  { label: 'Married To', value: 'married_to' },
  { label: 'Partner Of', value: 'partner_of' },
  { label: 'Sibling Of', value: 'sibling_of' },
]);


const formatDateForApi = (date: Date | string | undefined): string | undefined => {
  if (!date) return undefined;
  const d = new Date(date);
  if (isNaN(d.getTime())) return typeof date === 'string' ? date : undefined;
  return d.toISOString().split('T')[0];
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString();
};

const fetchPersonDetails = async () => {
  if (!isEditMode.value || !personId.value) return;
  detailsLoading.value = true;
  try {
    const response = await fetch(`${API_URL}/persons/${personId.value}`);
    if (!response.ok) throw new Error('Failed to fetch person details');
    const data = await response.json();
    person.value = { ...data };
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load person data.', life: 3000 });
    router.push({ name: 'PersonsList' });
  } finally {
    detailsLoading.value = false;
  }
};

const fetchAllPersons = async () => {
  try {
    const response = await fetch(`${API_URL}/persons`);
    if (!response.ok) throw new Error('Failed to fetch list of persons');
    const data = await response.json();
    allPersons.value = data.map((p: Person) => ({
      ...p,
      fullName: `${p.first_name} ${p.last_name || ''} (ID: ${p.id})`
    }));
  } catch (error) {
    console.error('Error fetching all persons:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Could not load persons for relationship form.', life: 3000 });
  }
};

const availablePersonsForRelationship = computed(() => {
  return allPersons.value.filter(p => p.id !== personId.value);
});

const fetchRelationships = async () => {
  if (!isEditMode.value || !personId.value) return;
  relationshipsLoading.value = true;
  try {
    const response = await fetch(`${API_URL}/persons/${personId.value}/relationships`);
    if (!response.ok) throw new Error('Failed to fetch relationships');
    relationships.value = await response.json();
  } catch (error) {
    console.error('Error fetching relationships:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load relationships.', life: 3000 });
  } finally {
    relationshipsLoading.value = false;
  }
};

const handleDetailsSubmit = async () => {
  submitted.value = true;
  if (!person.value.first_name) {
    toast.add({ severity: 'warn', summary: 'Validation Error', detail: 'First name is required.', life: 3000 });
    return;
  }
  detailsLoading.value = true;
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const responseData = await response.json();
    if (!response.ok) throw new Error(responseData.message || `Failed to ${isEditMode.value ? 'update' : 'save'} person`);

    toast.add({ severity: 'success', summary: 'Success', detail: `Person ${isEditMode.value ? 'updated' : 'saved'} successfully.`, life: 3000 });
    if (!isEditMode.value && responseData.id) {
      router.push({ name: 'PersonEdit', params: { id: responseData.id } });
    } else {
      // If in edit mode, person.value is already updated, no need to re-fetch person details
      // but if last_name changed, the title of the page might need update if it uses person.value
    }
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Operation failed.', life: 3000 });
  } finally {
    detailsLoading.value = false;
    submitted.value = false; // Reset submission state for person details
  }
};

const goBack = () => {
  router.push({ name: 'PersonsList' });
};

const openNewRelationshipDialog = () => {
  newRelationship.value = { relatedPersonId: null, relationshipType: null, startDate: undefined, endDate: undefined };
  relationshipSubmitted.value = false; // Reset submission state for relationship dialog
  relationshipDialogVisible.value = true;
};

const hideRelationshipDialog = () => {
  relationshipDialogVisible.value = false;
};

const saveRelationship = async () => {
  relationshipSubmitted.value = true;
  if (!newRelationship.value.relatedPersonId || !newRelationship.value.relationshipType) {
    toast.add({ severity: 'warn', summary: 'Validation Error', detail: 'Relationship type and related person are required.', life: 3000 });
    return;
  }
  if (!personId.value) return;

  relationshipSaving.value = true;

  let person1_to_save = personId.value; // The person whose page we are on
  let person2_to_save = newRelationship.value.relatedPersonId;
  let type_to_save = newRelationship.value.relationshipType;

  if (type_to_save === 'child_of') {
    person1_to_save = newRelationship.value.relatedPersonId; // The selected relatedPerson becomes person1 (parent)
    person2_to_save = personId.value;                 // The current person (personId.value) becomes person2 (child)
    type_to_save = 'parent_of';                     // Store as 'parent_of'
  }
  // For 'sibling_of', 'married_to', 'partner_of', we might want to ensure p1 < p2 to avoid duplicates like (A,B,married_to) and (B,A,married_to)
  // However, the backend unique constraint (p1, p2, type) should handle this if p1 and p2 are always stored in a consistent order by the API for such types.
  // The current backend API POST /api/persons/:personId/relationships uses :personId as person1_id.
  // So, if we always call with the current person's ID in the URL, this standardization is important.

  const payload = {
    // relatedPersonId in payload refers to person2_id for the API endpoint /api/persons/:personId/relationships
    relatedPersonId: person2_to_save,
    relationshipType: type_to_save,
    startDate: formatDateForApi(newRelationship.value.startDate),
    endDate: formatDateForApi(newRelationship.value.endDate),
  };

  try {
    const response = await fetch(`${API_URL}/persons/${person1_to_save}/relationships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const responseData = await response.json();
    if (!response.ok) throw new Error(responseData.message || 'Failed to save relationship');

    toast.add({ severity: 'success', summary: 'Success', detail: 'Relationship saved.', life: 3000 });
    fetchRelationships();
    hideRelationshipDialog();
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Could not save relationship.', life: 3000 });
  } finally {
    relationshipSaving.value = false;
  }
};

const confirmDeleteRelationship = (rel: Relationship) => {
  confirm.require({
    message: `Are you sure you want to delete the relationship with ${formatRelatedPersonName(rel)} (${formatRelationshipType(rel)})?`, // More descriptive message
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClassName: 'p-button-danger',
    accept: async () => {
      await deleteRelationship(rel.id);
    },
  });
};

const deleteRelationship = async (relationshipIdToDelete: number) => {
  try {
    const response = await fetch(`${API_URL}/relationships/${relationshipIdToDelete}`, { method: 'DELETE' });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete relationship');
    }
    toast.add({ severity: 'success', summary: 'Success', detail: 'Relationship deleted.', life: 3000 });
    fetchRelationships();
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Could not delete relationship.', life: 3000 });
  }
};

const formatRelatedPersonName = (relationship: Relationship): string => {
  if (relationship.person1_id === personId.value) {
    return `${relationship.person2_first_name} ${relationship.person2_last_name || ''}`;
  }
  if (relationship.person2_id === personId.value) {
    return `${relationship.person1_first_name} ${relationship.person1_last_name || ''}`;
  }
  return 'Unknown';
};

const formatRelationshipType = (relationship: Relationship): string => {
  let displayType = relationship.relationship_type;
  if (relationship.relationship_type === 'parent_of' && relationship.person2_id === personId.value) {
    displayType = 'Child Of';
  } else if (relationship.relationship_type === 'parent_of' && relationship.person1_id === personId.value) {
    displayType = 'Parent Of';
  }
  return displayType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};


onMounted(() => {
  fetchAllPersons();
  if (isEditMode.value) {
    fetchPersonDetails();
    fetchRelationships();
  }
});

watch(personId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    // Reset person form for the new ID before fetching, to avoid showing old data briefly
    person.value = { first_name: '', last_name: 'Herrmann' };
    relationships.value = [];
    fetchAllPersons(); // Usually already loaded, but good for safety.
    fetchPersonDetails();
    fetchRelationships();
  } else if (!newId && route.name === 'PersonCreate') { // Navigating to create mode
     person.value = { first_name: '', last_name: 'Herrmann' };
     relationships.value = [];
     // allPersons should still be loaded
  }
}, { immediate: true }); // immediate: true to run watcher on component mount for initial setup if personId is already there

</script>

<style scoped>
.person-form-view {
  max-width: 900px;
  margin: 0 auto;
}
.card {
  padding: 1.5rem;
  border-radius: 8px; /* Consistent border radius */
}
.p-tabview .p-tabview-nav li .p-tabview-nav-link {
    padding: 1rem 1.25rem;
}
.form-actions {
  border-top: 1px solid var(--surface-border);
  padding-top: 1.5rem;
}
.align-self-center {
  align-self: center;
}
.align-self-start {
  align-self: flex-start;
  padding-top: 0.5rem; /* Adjust if label is too high for textarea */
}

/* Custom panel style for calendar to ensure it's above dialogs if necessary, though usually handled by PrimeVue */
:deep(.custom-calendar-panel) {
  z-index: 1101 !important; /* Higher than default dialog z-index if issues arise */
}
</style>
