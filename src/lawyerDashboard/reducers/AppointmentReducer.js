import create from 'zustand'

const UseAppointmentStore = create(set => ({
  eventTimeStart: '',
  eventTimeEnd: '',
  eventName: '',
  eventDesc: '',
  eventDateStart: '',
  eventDateEnd: '',
  event: {},
  clientId: '',
  clientFirstName: '',
  clientLastName: '',
  location: '',
  remarks: '',

  setRemarks: newRemark =>
    set(() => ({
      remarks: newRemark,
    })),
  setLocation: newLocation =>
    set(() => ({
      location: newLocation,
    })),
  setClientFirstName: newClientFirstName =>
    set(() => ({
      clientFirstName: newClientFirstName,
    })),
  setClientLastName: newClientLastName =>
    set(() => ({
      clientLastName: newClientLastName,
    })),
  setEventTimeStart: newEventTimeStart =>
    set(() => ({
      eventTimeStart: newEventTimeStart,
    })),
  setEventTimeEnd: newEventTimeEnd =>
    set(() => ({
      eventTimeEnd: newEventTimeEnd,
    })),
  setEventName: newEventName =>
    set(() => ({
      eventName: newEventName,
    })),
  setEventDesc: newEventDesc =>
    set(() => ({
      eventDesc: newEventDesc,
    })),
  setEventDateStart: newEventDateStart =>
    set(() => ({
      eventDateStart: newEventDateStart,
    })),
  setEventDateEnd: newEventDateEnd =>
    set(() => ({
      eventDateEnd: newEventDateEnd,
    })),
  setClientId: newClientId =>
    set(() => ({
      clientId: newClientId,
    })),
  setEvent: (
    newClientFirstName,
    newClientLastName,
    newClientId,
    newEventName,
    newEventDesc,
    newEventStart,
    newEventEnd,
    newEventDateStart,
    newEventDateEnd
  ) =>
    set(() => ({
      event: {
        clientFirstName: newClientFirstName,
        clientLastName: newClientLastName,
        clientId: newClientId,
        eventName: newEventName,
        eventDesc: newEventDesc,
        eventStart: newEventStart,
        eventEnd: newEventEnd,
        eventDateStart: newEventDateStart,
        eventDateEnd: newEventDateEnd,
      },
    })),
}))

export default UseAppointmentStore
