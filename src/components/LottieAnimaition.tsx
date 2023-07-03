import { LottiePlayer } from 'lottie-web';
import { useEffect, useRef, useState } from 'react';

const LottieAnimaition: React.FC<LottieAnimaitionProps> = ({
  animation: animationData,
  className,
  speed,
  autoplay,
  loop,
}) => {
  const lottieRef = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    import('lottie-web').then((Lottie) => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (lottie && lottieRef.current) {
      const animation = lottie.loadAnimation({
        container: lottieRef.current,
        renderer: 'svg',
        loop: loop,
        autoplay: autoplay,
        animationData,
      });
      if (speed) animation.setSpeed(speed);
      return () => animation.destroy();
    }
  }, [lottie]);
  return (
    <>
      <div className={className} ref={lottieRef} />
    </>
  );
};

LottieAnimaition.defaultProps = {
  autoplay: true,
  loop: true,
};

interface LottieAnimaitionProps {
  animation: NodeRequire;
  className?: string;
  speed?: number;
  autoplay?: boolean;
  loop?: boolean;
}

export default LottieAnimaition;
