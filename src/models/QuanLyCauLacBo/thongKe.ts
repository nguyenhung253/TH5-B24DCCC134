import { useMemo } from 'react';
import { useModel } from 'umi';
import { IThongKeCauLacBo } from '@/services/QuanLyCauLacBo/types';
import { thongKeService } from '@/services/QuanLyCauLacBo/thongKe';

export default () => {
	const cauLacBoModel = useModel('QuanLyCauLacBo.cauLacBo');
	const donDangKyModel = useModel('QuanLyCauLacBo.donDangKy');
	const thanhVienModel = useModel('QuanLyCauLacBo.thanhVien');

	const thongKe = useMemo((): IThongKeCauLacBo => {
		return thongKeService.generateThongKe(
			cauLacBoModel.cauLacBos,
			donDangKyModel.donDangKys,
			thanhVienModel.thanhViens,
		);
	}, [cauLacBoModel.cauLacBos, donDangKyModel.donDangKys, thanhVienModel.thanhViens]);

	const chartData = useMemo(() => thongKeService.getChartData(thongKe), [thongKe]);

	const overviewStats = useMemo(() => thongKeService.getOverviewStats(thongKe), [thongKe]);

	const generateThongKe = (): IThongKeCauLacBo => thongKe;
	const getChartData = () => chartData;
	const getOverviewStats = () => overviewStats;

	return {
		generateThongKe,
		getChartData,
		getOverviewStats,
	};
};
