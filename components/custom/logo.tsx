import Image from "next/image";

const Logo = () => {
  return (
    <div>
      <Image src={"/askdb.svg"} alt="askdb" width={50} height={50} />
    </div>
  );
};

export default Logo;
