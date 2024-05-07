import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "ea82a03addfc"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "User",
        sa.Column("username", sa.String(), nullable=True),
        sa.Column("password", sa.String(), nullable=True),
        sa.Column("email", sa.String(), unique=True, nullable=True),
        sa.Column("first_name", sa.String(), nullable=True),
        sa.Column("last_name", sa.String(), nullable=True),
        sa.Column("active", sa.Boolean(), nullable=True),
        sa.Column("role", sa.String(), nullable=True),
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("create_date", sa.DateTime(), nullable=True),
        sa.Column("update_date", sa.DateTime(), nullable=True),
        sa.Column(
            'country',
            sa.Enum(
                'RUSSIA',
                'BELARUS',
                name='country'),
            nullable=True),
        sa.Column(
            'city',
            sa.Enum(
                'MOSCOW',
                'SAINT_PETERSBURG',
                'MINSK',
                name='city'),
            nullable=True),
        sa.Column("telegram", sa.String(), unique=True, nullable=True),
        sa.Column("linkedin", sa.String(), unique=True, nullable=True),
        sa.Column("github", sa.String(), unique=True, nullable=True),
        sa.Column(
            'industry',
            sa.Enum(
                'SOFTWARE',
                'TELECOM',
                'CYBERSECURITY',
                'VIDEO_GAMES',
                'CLOUD_SERVICES',
                'FINANCE',
                name='industry'),
            nullable=True),
        sa.Column(
            'experience',
            sa.Enum(
                'JUNIOR',
                'MIDDLE',
                'SENIOR',
                'NO_EXP',
                name='experience'),
            nullable=True),
        sa.Column(
            'language',
            sa.Enum(
                'ENG',
                'RUS',
                name='language'),
            nullable=True),
        sa.Column(
            'hard',
            sa.Enum(
                'JAVASCRIPT',
                'TYPESCRIPT',
                'SQL',
                'REACTJS',
                name='hard'),
            nullable=True),
        sa.Column(
            'soft',
            sa.Enum(
                'COMMUNICATION',
                'CREATIVITY',
                'LEADERSHIP',
                name='soft'),
            nullable=True),
        sa.Column(
            'education',
            sa.Enum(
                'HIGH_SCHOOL',
                'BACHELOR',
                'MASTER',
                name='education'),
            nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(op.f("ix_User_create_date"), "User", ["create_date"], unique=False)
    op.create_index(op.f("ix_User_id"), "User", ["id"], unique=True)
    op.create_index(op.f("ix_User_update_date"), "User", ["update_date"], unique=False)
    op.create_index(op.f("ix_User_username"), "User", ["username"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_User_username"), table_name="User")
    op.drop_index(op.f("ix_User_update_date"), table_name="User")
    op.drop_index(op.f("ix_User_id"), table_name="User")
    op.drop_index(op.f("ix_User_create_date"), table_name="User")
    op.drop_table("User")
