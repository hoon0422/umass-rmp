type props = {
  children?: JSX.Element;
};

export default function BannerView(props: props) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {props.children}
    </div>
  );
}
