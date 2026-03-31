import { ICauLacBo, IDonDangKy, IThanhVienCauLacBo, IThongKeCauLacBo } from './types';

class ThongKeService {
	generateThongKe(
		cauLacBos: ICauLacBo[],
		donDangKys: IDonDangKy[],
		thanhViens: IThanhVienCauLacBo[],
	): IThongKeCauLacBo {
		const tongSoCauLacBo = cauLacBos.length;
		const tongSoDonDangKy = donDangKys.length;
		const soDonPending = donDangKys.filter((don) => don.trangThai === 'Pending').length;
		const soDonApproved = donDangKys.filter((don) => don.trangThai === 'Approved').length;
		const soDonRejected = donDangKys.filter((don) => don.trangThai === 'Rejected').length;
		const tongSoThanhVien = thanhViens.filter((tv) => tv.trangThai === 'Active').length;

		// Thống kê đơn theo câu lạc bộ
		const thongKeDonTheoCauLacBo = cauLacBos.map((clb) => {
			const donsCuaCLB = donDangKys.filter((don) => don.cauLacBoId === clb.id);
			return {
				cauLacBoId: clb.id,
				tenCauLacBo: clb.tenCauLacBo,
				pending: donsCuaCLB.filter((don) => don.trangThai === 'Pending').length,
				approved: donsCuaCLB.filter((don) => don.trangThai === 'Approved').length,
				rejected: donsCuaCLB.filter((don) => don.trangThai === 'Rejected').length,
			};
		});

		return {
			tongSoCauLacBo,
			tongSoDonDangKy,
			soDonPending,
			soDonApproved,
			soDonRejected,
			thongKeDonTheoCauLacBo,
			tongSoThanhVien,
		};
	}

	getChartData(thongKe: IThongKeCauLacBo) {
		return {
			categories: thongKe.thongKeDonTheoCauLacBo.map((item) => item.tenCauLacBo),
			series: [
				{
					name: 'Chờ duyệt',
					data: thongKe.thongKeDonTheoCauLacBo.map((item) => item.pending),
					color: '#facc15', // yellow-400
				},
				{
					name: 'Đã duyệt',
					data: thongKe.thongKeDonTheoCauLacBo.map((item) => item.approved),
					color: '#22c55e', // green-500
				},
				{
					name: 'Từ chối',
					data: thongKe.thongKeDonTheoCauLacBo.map((item) => item.rejected),
					color: '#ef4444', // red-500
				},
			],
		};
	}

	getOverviewStats(thongKe: IThongKeCauLacBo) {
		return [
			{
				title: 'Tổng câu lạc bộ',
				value: thongKe.tongSoCauLacBo,
				color: '#3b82f6', // blue-500
				icon: 'TeamOutlined',
			},
			{
				title: 'Chờ duyệt',
				value: thongKe.soDonPending,
				color: '#facc15', // yellow-400
				icon: 'ClockCircleOutlined',
			},
			{
				title: 'Đã duyệt',
				value: thongKe.soDonApproved,
				color: '#22c55e', // green-500
				icon: 'CheckCircleOutlined',
			},
			{
				title: 'Từ chối',
				value: thongKe.soDonRejected,
				color: '#ef4444', // red-500
				icon: 'CloseCircleOutlined',
			},
		];
	}
}

export const thongKeService = new ThongKeService();
