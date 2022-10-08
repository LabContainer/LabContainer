"""rev

Revision ID: 474840720280
Revises: fbe63ab0ed7d
Create Date: 2022-10-08 03:41:36.341907

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '474840720280'
down_revision = 'fbe63ab0ed7d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_user_email', table_name='user')
    op.drop_index('ix_user_username', table_name='user')
    op.drop_table('user')
    op.drop_index('ix_refresh_tokens_token', table_name='refresh_tokens')
    op.drop_table('refresh_tokens')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('refresh_tokens',
    sa.Column('token', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('user', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['user'], ['user.username'], name='refresh_tokens_user_fkey'),
    sa.PrimaryKeyConstraint('token', name='refresh_tokens_pkey')
    )
    op.create_index('ix_refresh_tokens_token', 'refresh_tokens', ['token'], unique=False)
    op.create_table('user',
    sa.Column('username', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('email', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('hashed_password', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('is_active', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.Column('is_student', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('username', name='user_pkey')
    )
    op.create_index('ix_user_username', 'user', ['username'], unique=False)
    op.create_index('ix_user_email', 'user', ['email'], unique=False)
    # ### end Alembic commands ###
