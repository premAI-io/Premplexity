const TextLoading = () => {
  return (
    <div class={"grid gap-2 pl-6"}>
      {Array.from({ length: 4 }).map(() => (
        <div class={"loading__text__line"} />
      ))}
    </div>
  )
}

export default TextLoading
