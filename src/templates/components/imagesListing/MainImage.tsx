import Spinner from "$templates/components/Spinner"

type Props = {
  image: string
  swapOOB?: string
}

const MainImage = ({
  image,
  swapOOB
}: Props) => {
  return (
    <div
      id="main-image"
      class={"images-listing__main-image loading"}
      {...swapOOB ? { "hx-swap-oob": swapOOB } : {}}
    >
      <Spinner size={50} />
      <img
        src={image}
        alt="Main image"
        class={"max-w-full max-h-full object-center object-cover"}
      />
    </div>
  )
}

export default MainImage
