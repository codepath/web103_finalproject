import { FaWindows, FaPlaystation, FaXbox, FaApple, FaAndroid,} from 'react-icons/fa';
import { IconType } from 'react-icons';

interface Props {
  platforms: number[];
}

const PlatformMapper = ({ platforms = [] }: Props) => {
  const iconMap: { [key: string]: IconType } = {
    3: FaWindows,
    1: FaPlaystation,
    4: FaAndroid,
    2: FaXbox,
    5: FaApple,
  };

  return (
    <div className="flex flex-row">
      {platforms.map((platform,i) => {
        const IconComponent = iconMap[platform];
        return (
          <IconComponent
            key={i}
            className="mr-2 fill-neutral-300 hover:fill-pink-500 hover:scale-125 transition"
            stroke="black"
            strokeWidth="4" // Add some margin to the right of each icon
          />
        );
      })}
    </div>
  );
};

export default PlatformMapper;
