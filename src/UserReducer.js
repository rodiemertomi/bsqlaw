import create from 'zustand'

const UseUserReducer = create(set => ({
  username: '',
  role: '',
  email: '',
  photoURL: '',
  expertise: {},
  appointments: [{}],
  id: '',
  initials: '',

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
}))

export default UseUserReducer
