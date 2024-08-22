type Props = {
  image: string
}

const ThreadImageCard = ({
  image
}: Props) => {
  return (
    <div class={"image-card-container"}>
      <img src={image} class={"h-full w-full object-center object-cover"} />
    </div>
  )
}

export default ThreadImageCard
