const getAccountSlug = () => {
  const { pathname } = window.location
  return pathname && pathname.split('/')[1] ? pathname.split('/')[2] : null
}

export default getAccountSlug
