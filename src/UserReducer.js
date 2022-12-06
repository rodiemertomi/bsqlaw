import create from 'zustand'

const UseUserReducer = create(set => ({
  firstName: '',
  lastName: '',
  username: '',
  role: '',
  email: '',
  photoURL: '',
  expertise: [],
  appointments: [],
  id: '',
  initials: '',
  birthday: '',
  gender: '',
  contactNo: '',
  clients: [],
  password: '',
  lawyers: '',

  setLawyers: newLawyers =>
    set(() => ({
      lawyers: newLawyers,
    })),
  setClients: newClients =>
    set(() => ({
      clients: newClients,
    })),
  setFirstName: newFirstName =>
    set(() => ({
      firstName: newFirstName,
    })),
  setLastName: newLastName =>
    set(() => ({
      lastName: newLastName,
    })),
  setContactNo: newContactNo =>
    set(() => ({
      contactNo: newContactNo,
    })),
  setGender: newGender =>
    set(() => ({
      gender: newGender,
    })),
  setUsername: newUsername =>
    set(() => ({
      username: newUsername,
    })),
  setRole: newRole =>
    set(() => ({
      role: newRole,
    })),
  setEmail: newEmail =>
    set(() => ({
      email: newEmail,
    })),
  setPhotoURL: newPhotoURL =>
    set(() => ({
      photoURL: newPhotoURL,
    })),
  setExpertise: newExpertise =>
    set(() => ({
      expertise: newExpertise,
    })),
  setAppointments: newAppointments =>
    set(state => ({
      appointments: { ...state.appointments, newAppointments },
    })),
  setId: newId =>
    set(() => ({
      id: newId,
    })),
  setInitials: newInitials =>
    set(() => ({
      initials: newInitials,
    })),
  setBirthday: newBirthday =>
    set(() => ({
      birthday: newBirthday,
    })),
  setPassword: newPassword =>
    set(() => ({
      password: newPassword,
    })),
}))

export default UseUserReducer
