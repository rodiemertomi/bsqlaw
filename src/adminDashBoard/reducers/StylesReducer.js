import create from 'zustand'

const useStylesStore = create(set => ({
  adminControl: false,

  hideAdminControl: () =>
    set(state => ({
      adminControl: !state.adminControl,
    })),
  closeAdminControl: () =>
    set(() => ({
      adminControl: false,
    })),
}))

export default useStylesStore
