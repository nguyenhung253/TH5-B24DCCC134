import { useEffect } from 'react';
import { useModel } from 'umi';
import { Row, Col, Card, Statistic, Button, Space } from 'antd';
import {
	TeamOutlined,
	FileTextOutlined,
	ClockCircleOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	UserOutlined,
	DownloadOutlined,
} from '@ant-design/icons';
import { ColumnChart } from '@/components/Chart';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

export default function BaoCaoThongKe() {
	const thongKeModel = useModel('QuanLyCauLacBo.thongKe');
	const cauLacBoModel = useModel('QuanLyCauLacBo.cauLacBo');
	const thanhVienModel = useModel('QuanLyCauLacBo.thanhVien');

	useEffect(() => {
		cauLacBoModel.loadCauLacBo();
		thanhVienModel.loadThanhVien();
	}, []);

	const thongKe = thongKeModel.generateThongKe();
	const chartData = thongKeModel.getChartData();
	const overviewStats = thongKeModel.getOverviewStats();

	const handleExportAllMembers = () => {
		const allMembers = thanhVienModel.thanhViens.filter((tv) => tv.trangThai === 'Active');

		const exportData = allMembers.map((tv, index) => ({
			STT: index + 1,
			'Họ tên': tv.hoTen,
			Email: tv.email,
			'Số điện thoại': tv.soDienThoai,
			'Giới tính': tv.gioiTinh,
			'Địa chỉ': tv.diaChi,
			'Sở trường': tv.soTruong,
			'Câu lạc bộ': getCauLacBoName(tv.cauLacBoId),
			'Ngày tham gia': dayjs(tv.ngayThamGia).format('DD/MM/YYYY'),
		}));

		const ws = XLSX.utils.json_to_sheet(exportData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Tất cả thành viên');
		XLSX.writeFile(wb, `Danh_sach_tat_ca_thanh_vien_${dayjs().format('YYYY-MM-DD')}.xlsx`);
	};

	const handleExportByCauLacBo = () => {
		const wb = XLSX.utils.book_new();

		cauLacBoModel.cauLacBos.forEach((clb) => {
			const members = thanhVienModel.getThanhVienByCauLacBo(clb.id);

			const exportData = members.map((tv, index) => ({
				STT: index + 1,
				'Họ tên': tv.hoTen,
				Email: tv.email,
				'Số điện thoại': tv.soDienThoai,
				'Giới tính': tv.gioiTinh,
				'Địa chỉ': tv.diaChi,
				'Sở trường': tv.soTruong,
				'Ngày tham gia': dayjs(tv.ngayThamGia).format('DD/MM/YYYY'),
			}));

			const ws = XLSX.utils.json_to_sheet(exportData);
			XLSX.utils.book_append_sheet(wb, ws, clb.tenCauLacBo.substring(0, 30));
		});

		XLSX.writeFile(wb, `Danh_sach_thanh_vien_theo_CLB_${dayjs().format('YYYY-MM-DD')}.xlsx`);
	};

	const getCauLacBoName = (cauLacBoId: string) => {
		const cauLacBo = cauLacBoModel.cauLacBos.find((clb) => clb.id === cauLacBoId);
		return cauLacBo?.tenCauLacBo || 'N/A';
	};
	return (
		<div className='card-section'>
			<div className='section-header'>
				<h3 className='section-title'>
					<TeamOutlined /> Báo cáo và thống kê
				</h3>
				<Space>
					<Button type='default' icon={<DownloadOutlined />} onClick={handleExportAllMembers}>
						Xuất tất cả thành viên
					</Button>
					<Button type='primary' icon={<DownloadOutlined />} onClick={handleExportByCauLacBo}>
						Xuất theo câu lạc bộ
					</Button>
				</Space>
			</div>

			{/* Thống kê tổng quan */}
			<div className='stats-grid'>
				<Card className='stat-card'>
					<div className='stat-icon' style={{ color: '#1890ff' }}>
						<TeamOutlined />
					</div>
					<Statistic title='Tổng câu lạc bộ' value={thongKe.tongSoCauLacBo} className='stat-value' />
				</Card>

				<Card className='stat-card'>
					<div className='stat-icon' style={{ color: '#faad14' }}>
						<ClockCircleOutlined />
					</div>
					<Statistic title='Đơn chờ duyệt' value={thongKe.soDonPending} className='stat-value' />
				</Card>

				<Card className='stat-card'>
					<div className='stat-icon' style={{ color: '#52c41a' }}>
						<CheckCircleOutlined />
					</div>
					<Statistic title='Đơn đã duyệt' value={thongKe.soDonApproved} className='stat-value' />
				</Card>

				<Card className='stat-card'>
					<div className='stat-icon' style={{ color: '#ff4d4f' }}>
						<CloseCircleOutlined />
					</div>
					<Statistic title='Đơn từ chối' value={thongKe.soDonRejected} className='stat-value' />
				</Card>

				<Card className='stat-card'>
					<div className='stat-icon' style={{ color: '#722ed1' }}>
						<UserOutlined />
					</div>
					<Statistic title='Tổng thành viên' value={thongKe.tongSoThanhVien} className='stat-value' />
				</Card>

				<Card className='stat-card'>
					<div className='stat-icon' style={{ color: '#13c2c2' }}>
						<FileTextOutlined />
					</div>
					<Statistic title='Tổng đơn đăng ký' value={thongKe.tongSoDonDangKy} className='stat-value' />
				</Card>
			</div>

			{/* Biểu đồ thống kê */}
			<div className='chart-section'>
				<h4 className='chart-title'>Thống kê đơn đăng ký theo câu lạc bộ</h4>
				<ColumnChart
					xAxis={chartData.categories}
					yAxis={chartData.series.map((s) => s.data)}
					yLabel={chartData.series.map((s) => s.name)}
					colors={chartData.series.map((s) => s.color)}
					height={400}
					formatY={(val) => val.toString()}
				/>
			</div>

			{/* Bảng chi tiết */}
			<div className='chart-section'>
				<h4 className='chart-title'>Chi tiết theo câu lạc bộ</h4>
				<Row gutter={16}>
					{thongKe.thongKeDonTheoCauLacBo.map((item) => (
						<Col span={8} key={item.cauLacBoId} style={{ marginBottom: 16 }}>
							<Card
								title={item.tenCauLacBo}
								size='small'
								extra={
									<Button
										size='small'
										icon={<DownloadOutlined />}
										onClick={() => {
											const members = thanhVienModel.getThanhVienByCauLacBo(item.cauLacBoId);
											const exportData = members.map((tv, index) => ({
												STT: index + 1,
												'Họ tên': tv.hoTen,
												Email: tv.email,
												'Số điện thoại': tv.soDienThoai,
												'Giới tính': tv.gioiTinh,
												'Địa chỉ': tv.diaChi,
												'Sở trường': tv.soTruong,
												'Ngày tham gia': dayjs(tv.ngayThamGia).format('DD/MM/YYYY'),
											}));

											const ws = XLSX.utils.json_to_sheet(exportData);
											const wb = XLSX.utils.book_new();
											XLSX.utils.book_append_sheet(wb, ws, 'Thành viên');
											XLSX.writeFile(
												wb,
												`${item.tenCauLacBo.replace(/\s+/g, '_')}_${dayjs().format('YYYY-MM-DD')}.xlsx`,
											);
										}}
									>
										Xuất
									</Button>
								}
							>
								<Row gutter={8}>
									<Col span={12}>
										<Statistic title='Chờ duyệt' value={item.pending} valueStyle={{ color: '#faad14', fontSize: 16 }} />
									</Col>
									<Col span={12}>
										<Statistic title='Đã duyệt' value={item.approved} valueStyle={{ color: '#52c41a', fontSize: 16 }} />
									</Col>
								</Row>
								<Row gutter={8} style={{ marginTop: 8 }}>
									<Col span={12}>
										<Statistic title='Từ chối' value={item.rejected} valueStyle={{ color: '#ff4d4f', fontSize: 16 }} />
									</Col>
									<Col span={12}>
										<Statistic
											title='Thành viên'
											value={thanhVienModel.getThanhVienByCauLacBo(item.cauLacBoId).length}
											valueStyle={{ color: '#722ed1', fontSize: 16 }}
										/>
									</Col>
								</Row>
							</Card>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
}
