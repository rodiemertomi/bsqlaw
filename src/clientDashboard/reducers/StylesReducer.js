import create from 'zustand'

const useStylesStore = create(set => ({
  profile: false,
  dashboard: false,
  lawyers: false,
  caseFolder: false,
  appointment: false,

  hideProfile: () =>
    set(state => ({
      profile: !state.profile,
      dashboard: false,
      lawyers: false,
      caseFolder: false,
      appointment: false,
    })),
  hideDashboard: () =>
    set(state => ({
      profile: false,
      dashboard: !state.dashboard,
      lawyers: false,
      caseFolder: false,
      appointment: false,
    })),
  hideCaseFolder: () =>
    set(state => ({
      profile: false,
      dashboard: false,
      lawyers: false,
      caseFolder: !state.caseFolder,
      appointment: false,
    })),
  hideAppointment: () =>
    set(state => ({
      profile: false,
      dashboard: false,
      lawyers: false,
      caseFolder: false,
      appointment: !state.appointment,
    })),
  hideLawyers: () =>
    set(state => ({
      profile: false,
      dashboard: false,
      lawyers: !state.lawyers,
      caseFolder: false,
      appointment: false,
    })),
}))

export default useStylesStore
