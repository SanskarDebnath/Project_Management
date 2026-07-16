from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

class WorkOrderPdfService:

    @staticmethod
    def generate_pdf(work_order) -> bytes:
        buffer = BytesIO()
        document = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin = 15 * mm,
            leftMargin = 15 * mm,
            topMargin = 15 * mm,
            bottomMargin = 15 * mm,
        )

        styles = getSampleStyleSheet()
        story = []

        story.append(
            Paragraph(
            "<b>WORK ORDER</b>",
            styles["Title"],
            )
        )
        story.append(Spacer(1, 8 * mm))

        information = [
            [
                "Work Order No.",
                work_order.work_order_number,
                "Date", str(work_order.work_order_created_at.date()
                ),
            ],

            [
                "Project",
                work_order.project_name_snapshot,
                "Department",
                work_order.department_name_snapshot,
            ],
            [
                "Developer",
                work_order.developer_name_snapshot,
                "Officer",
                work_order.officer_name_snapshot,
            ],
        ]

        information_table = Table(
            information,
            colWidths=[
                35 * mm,
                55 * mm,
                30 * mm,
                55 * mm,
            ],
        )

        information_table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
                    ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                    ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 5),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ]
            )
        )

        story.append(information_table)
        story.append(Spacer(1, 10 * mm))

        assignment_data = [
            [
                "Tier",
                "Monthly Salary",
                "Start Date",
                "End Date",
            ],
            [
                str(work_order.tier),
                f"Rs. {work_order.monthly_salary}",
                str(work_order.work_order_start_date),
                str(work_order.work_order_end_date),
            ],
        ]

        assignment_table = Table(
            assignment_data,
            colWidths=[35 * mm, 50 * mm, 45 * mm, 45 * mm],
        )

        assignment_table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("TOPPADDING", (0, 0), (-1, -1), 7),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ]
            )
        )

        story.append(assignment_table)
        story.append(Spacer(1, 10 * mm))

        if work_order.work_order_description:
            story.append(
                Paragraph(
                    "<b>Description</b>",
                    styles["Heading3"],
                )
            )

            story.append(
                Paragraph(
                    work_order.work_order_description,
                    styles["BodyText"],
                )
            )

        story.append(Spacer(1, 25 * mm))

        story.append(
            Paragraph(
                "Digitally signed by:<br/>"
                f"<b>{work_order.officer_name_snapshot}</b>",
                styles["BodyText"],
            )
        )

        document.build(story)

        pdf_bytes = buffer.getvalue()
        buffer.close()

        return pdf_bytes