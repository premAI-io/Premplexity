const SourceLoading = () => {
  return (
    <div class={"loading__sources__container"}>
      <div class={"loading__sources__line"} />
      <div class={"loading__sources__line"} />
      <div class={"loading__sources__footer"}>
        <div class={"loading__sources__dot"} />
        <div class={"loading__sources__line flex-1"} />
        <div class={"loading__sources__dot"} />
      </div>
    </div>
  )
}

const SourcesLoading = () => {
  return (
    <div class={"thread_sources_grid"}>
      <SourceLoading />
      <SourceLoading />
      <SourceLoading />
      <SourceLoading />
      <SourceLoading />
    </div>
  )
}

export default SourcesLoading
