import { ResError } from '@dto/response';

type props = {
  error: ResError;
  style?: React.CSSProperties;
};

export default function praseError({ error, style }: props) {
  return (
    <>
      {error.message.map((m, i) => (
        <div style={style} key={i}>
          {m}
        </div>
      ))}
    </>
  );
}
