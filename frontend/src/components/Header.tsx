import { Button } from "./ui/button";
import { AiOutlineSearch } from "react-icons/ai";

const Header = () => {
  return (
    <div className="bg-white max-w-md w-full z-50 absolute h-14 flex items-center">
      <div className="w-full pl-4 flex font-bold text-xl">Libro</div>
        <Button variant={"outline"} size="icon" className="aspect-square mr-1">
          <AiOutlineSearch size={"1.2rem"} className="justify-items-end" />
        </Button>
        <Button className="aspect-square mr-1 w-24 bg-[#9268EB] hover:bg-[#684ba6]">
          로그인
        </Button>
    </div>
  );
};

export default Header;
