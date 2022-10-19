import create from 'zustand'

const UseAppointmentStore = create(set => ({
  date: new Date(),

  onChange: newDate =>
    set(state => ({
      date: { ...state, newDate },
    })),
}))

export default UseAppointmentStore
