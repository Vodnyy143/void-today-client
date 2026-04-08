import styles from './HeatMap.module.css';

interface Props {
  data: { date: string; count: number }[];
}

const getIntensity = (count: number) => {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  return 3;
};

export default function HeatMap({ data }: Props) {
  return (
    <div className={styles.grid}>
      {data.map((item, i) => (
        <div
          key={i}
          className={`${styles.cell} ${styles[`level${getIntensity(item.count)}`]}`}
          title={`${item.date}: ${item.count} задач`}
        />
      ))}
    </div>
  );
}
